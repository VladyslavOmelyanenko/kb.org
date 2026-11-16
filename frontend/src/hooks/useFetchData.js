import { useState, useEffect } from 'react';
import axios from 'axios';

// Route language -> locale folder name in public/data
const LOCALES = { ukr: 'uk', eng: 'en' };

// What Strapi returned when nothing matched
const EMPTY_RESPONSE = { data: [], meta: {} };

// File-safe name for a slug. Must match safe_slug() in scripts/export_strapi.py
const safeSlug = (slug) =>
  slug.replace(/[^a-z0-9-]/gu, (char) => '_' + char.codePointAt(0).toString(16));

// Reads content from the static JSON export of the old Strapi API:
//   <url>/<locale>/index.json            the whole collection
//   <url>/<locale>/by-slug/<slug>.json   the entries with that slug
// The last argument (fields to populate) is not needed any more, because the
// files already contain the related entries and images each page uses.
function useFetchData(url, language, filter = "") {
  const [data, setData] = useState(null);

  const locale = LOCALES[language] || language;
  const file = filter !== ""
    ? `${url}/${locale}/by-slug/${safeSlug(filter)}.json`
    : `${url}/${locale}/index.json`;

  useEffect(() => {
    let isCurrent = true;

    axios.get(file)
      .then(response => {
        // A missing file is answered with the app's index.html, not JSON
        const isJson = response.data && Array.isArray(response.data.data);
        if (isCurrent) setData(isJson ? response.data : EMPTY_RESPONSE);
      })
      .catch(error => {
        console.error(error);
        if (isCurrent && error.response && error.response.status === 404) {
          setData(EMPTY_RESPONSE);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [file]);

  return data;
}

export default useFetchData;
