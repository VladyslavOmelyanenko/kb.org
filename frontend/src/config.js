// The site no longer talks to a Strapi server. All content is read from the
// static JSON files in public/data, which were exported from the archived
// Strapi database with scripts/export_strapi.py.
const API_URL = '/data';
const SERVER_URL = '';

export  {API_URL, SERVER_URL};
