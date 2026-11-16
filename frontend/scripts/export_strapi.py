#!/usr/bin/env python3
"""Export the archived Strapi SQLite database to static JSON files.

Produces the same response shapes the Strapi v4 REST API returned for the
queries the frontend makes, so the site can run without a Strapi server.

Usage:
    python3 scripts/export_strapi.py <path-to-strapi-project> [output-dir]

    <path-to-strapi-project>  folder containing tmp/data.db and src/api/
    [output-dir]              defaults to public/data

Only the Python standard library is needed.
"""
import json
import re
import shutil
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

LOCALES = ["en", "uk", "de"]
PAGE_SIZE = 200  # rest.defaultLimit in the Strapi config

# What each page needs from Strapi. The old useFetchData hook asked for more
# (nested "populate: *"), but the pages only ever read the fields below, and
# leaving the rest out keeps the JSON files small.
STAR = "*"
VENUE_WITH_LOCATIONS = {"locations": True}
QUERIES = {
    # name: (content type, populate for the list, populate for a single slug)
    "venues": (
        "venue",
        {"locations": True},
        {
            "locations": True,
            "venueImages": True,
            "participants": True,
            "venue_locations": {"location": True, "participants": True},
            "venue_events": {"smallEvent": VENUE_WITH_LOCATIONS},
        },
    ),
    "participants": (
        "participant",
        {},
        {
            "participantImage": True,
            "projects": {"projectMedia": True, "venue": VENUE_WITH_LOCATIONS},
            "venues": VENUE_WITH_LOCATIONS,
        },
    ),
    "locations": (
        "location",
        {"locationImage": True, "cityLogo": True, "venues": VENUE_WITH_LOCATIONS},
        None,
    ),
    "about-pages": (
        "about-page",
        {"partnersLogos": True, "partnersLogosMobile": True},
        None,
    ),
}


def snake(name):
    name = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", name)
    return name.replace("-", "_").lower()


def iso(ms):
    if ms is None:
        return None
    if isinstance(ms, str):
        return ms
    dt = datetime.fromtimestamp(ms / 1000, tz=timezone.utc)
    return dt.strftime("%Y-%m-%dT%H:%M:%S.") + "%03dZ" % (ms % 1000)


def safe_slug(slug):
    """File-system-safe name for a slug. Must match safeSlug() in useFetchData.js."""
    return re.sub(r"[^a-z0-9-]", lambda m: "_%x" % ord(m.group(0)), slug)


class Exporter:
    def __init__(self, strapi_dir):
        self.db = sqlite3.connect("file:%s?mode=ro" % (strapi_dir / "tmp" / "data.db"), uri=True)
        self.db.row_factory = sqlite3.Row
        self.types = {}
        for path in sorted((strapi_dir / "src" / "api").glob("*/content-types/*/schema.json")):
            schema = json.loads(path.read_text())
            self.types[schema["info"]["singularName"]] = schema
        self.tables = {r[0] for r in self.db.execute("select name from sqlite_master where type='table'")}
        self.rows = {}
        for name, schema in self.types.items():
            table = schema["collectionName"]
            self.rows[name] = {r["id"]: r for r in self.db.execute('select * from "%s" order by id' % table)}
        self.files = {r["id"]: r for r in self.db.execute("select * from files")}
        self.dropped_drafts = 0

    # -- helpers -----------------------------------------------------------
    def columns(self, table):
        return [r[1] for r in self.db.execute('pragma table_info("%s")' % table)]

    def scalar(self, attr, value):
        kind = attr["type"]
        if value is None:
            return None
        if kind == "boolean":
            return bool(value)
        if kind == "json":
            return json.loads(value) if isinstance(value, str) else value
        return value

    def media(self, type_name, entry_id, field, multiple):
        rows = self.db.execute(
            'select file_id from files_related_morphs where related_type=? and related_id=? and field=? '
            'order by "order", id',
            ("api::%s.%s" % (type_name, type_name), entry_id, field),
        ).fetchall()
        items = []
        for (file_id,) in rows:
            f = self.files.get(file_id)
            if not f:
                continue
            items.append({
                "id": f["id"],
                "attributes": {
                    "name": f["name"],
                    "alternativeText": f["alternative_text"],
                    "caption": f["caption"],
                    "width": f["width"],
                    "height": f["height"],
                    "formats": json.loads(f["formats"]) if f["formats"] else None,
                    "hash": f["hash"],
                    "ext": f["ext"],
                    "mime": f["mime"],
                    "size": f["size"],
                    "url": f["url"],
                    "previewUrl": f["preview_url"],
                    "provider": f["provider"],
                    "provider_metadata": json.loads(f["provider_metadata"]) if f["provider_metadata"] else None,
                    "createdAt": iso(f["created_at"]),
                    "updatedAt": iso(f["updated_at"]),
                },
            })
        if multiple:
            return {"data": items or None}
        return {"data": items[0] if items else None}

    def related_ids(self, type_name, entry_id, attr_name, attr):
        """IDs of the entries linked through a relation attribute, in Strapi's order."""
        target = attr["target"].split(".")[-1]
        if "mappedBy" in attr:  # the join table belongs to the other side
            owner, owner_attr = target, attr["mappedBy"]
            table = "%s_%s_links" % (self.types[owner]["collectionName"], snake(owner_attr))
            mine, theirs = snake(type_name) + "_id", snake(owner) + "_id"
            order = snake(owner) + "_order"
        else:
            table = "%s_%s_links" % (self.types[type_name]["collectionName"], snake(attr_name))
            mine, theirs = snake(type_name) + "_id", snake(target) + "_id"
            order = snake(target) + "_order"
        if table not in self.tables:
            return []
        order_sql = '"%s", id' % order if order in self.columns(table) else "id"
        sql = 'select "%s" from "%s" where "%s"=? order by %s' % (theirs, table, mine, order_sql)
        return [r[0] for r in self.db.execute(sql, (entry_id,))]

    # -- serialising -------------------------------------------------------
    def entry(self, type_name, entry_id, populate):
        schema = self.types[type_name]
        row = self.rows[type_name][entry_id]
        attrs = {}
        if populate == STAR:
            populate = {
                name: True
                for name, attr in schema["attributes"].items()
                if attr["type"] in ("relation", "media")
            }
        for name, attr in schema["attributes"].items():
            kind = attr["type"]
            if kind == "media":
                if name in populate:
                    attrs[name] = self.media(type_name, entry_id, name, attr.get("multiple", False))
            elif kind == "relation":
                if name not in populate:
                    continue
                sub = populate[name]
                sub = {} if sub is True else sub
                target = attr["target"].split(".")[-1]
                items = []
                for rid in self.related_ids(type_name, entry_id, name, attr):
                    related = self.rows[target].get(rid)
                    if related is None:
                        continue
                    if related["published_at"] is None:  # drafts are not public
                        self.dropped_drafts += 1
                        continue
                    items.append(self.entry(target, rid, sub))
                if attr["relation"].endswith("ToMany"):
                    attrs[name] = {"data": items}
                else:
                    attrs[name] = {"data": items[0] if items else None}
            else:
                attrs[name] = self.scalar(attr, row[snake(name)])
        attrs["createdAt"] = iso(row["created_at"])
        attrs["updatedAt"] = iso(row["updated_at"])
        attrs["publishedAt"] = iso(row["published_at"])
        attrs["locale"] = row["locale"]
        return {"id": entry_id, "attributes": attrs}

    def response(self, type_name, ids, populate):
        ids = ids[:PAGE_SIZE]
        return {
            "data": [self.entry(type_name, i, populate) for i in ids],
            "meta": {"pagination": {"page": 1, "pageSize": PAGE_SIZE, "pageCount": 1 if ids else 0, "total": len(ids)}},
        }

    def export(self, out_dir):
        if out_dir.exists():
            shutil.rmtree(out_dir)
        count = 0
        for name, (type_name, list_populate, detail_populate) in QUERIES.items():
            for locale in LOCALES:
                published = [
                    i for i, r in self.rows[type_name].items()
                    if r["locale"] == locale and r["published_at"] is not None
                ]
                folder = out_dir / name / locale
                folder.mkdir(parents=True, exist_ok=True)
                self.write(folder / "index.json", self.response(type_name, published, list_populate))
                count += 1
                if detail_populate is None:
                    continue
                by_slug = {}
                for i in published:
                    slug = self.rows[type_name][i]["slug"]
                    if slug:
                        by_slug.setdefault(slug, []).append(i)
                for slug, ids in by_slug.items():
                    path = folder / "by-slug" / (safe_slug(slug) + ".json")
                    path.parent.mkdir(exist_ok=True)
                    self.write(path, self.response(type_name, ids, detail_populate))
                    count += 1
        return count

    @staticmethod
    def write(path, payload):
        path.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    strapi_dir = Path(sys.argv[1])
    out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("public/data")
    exporter = Exporter(strapi_dir)
    count = exporter.export(out_dir)
    print("Wrote %d files to %s" % (count, out_dir))
    print("Skipped %d links to unpublished (draft) entries" % exporter.dropped_drafts)


if __name__ == "__main__":
    main()
