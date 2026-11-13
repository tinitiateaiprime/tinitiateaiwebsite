# Tinitiate AI — Static Content Website

Next.js frontend with 101 static courses and 92 original HTML MasterClass pages.
Six Python MasterClasses include original prerecorded MP4 tutorials.
No Neon, PostgreSQL, SQLite, Payload CMS, student logins, trainer tooling,
editor/recorder workers, checkout, paywalls, or database-backed course content.

## Run locally

Requires Node 24.22.1 (see `.nvmrc`).

```cmd
npm.cmd install
npm.cmd run dev
```

Open http://localhost:3000.

## Enquiries

The only backend operation is `POST /api/request-callback`, which writes an
`{ pk: 'enquiry', type: 'enquiry' }` document to Azure Cosmos DB for NoSQL.
Provide `COSMOS_ENDPOINT`, `COSMOS_KEY`, `COSMOS_DATABASE` and
`COSMOS_CONTAINER` in `.env.local`. The first two must be set to real secrets.
The existing database/container defaults are `tinitiate` / `items`.
No Cosmos collection is used for courses, lessons, logins, subscriptions,
or progress.

## Content structure

- `src/data/courses.json` — static metadata for 101 courses.
- `src/data/masterclasses.json` — index of 92 original HTML pages.
- `public/masterclasses` — original HTML, JS, CSS and asset files.
- `public/masterclasses/Final-videos` — six original videos.
- `src/components/azure` and `public/azure` — retained original website design and images.

All MasterClasses are public and their videos can be downloaded. The website
requires a server-capable Next.js deployment to accept Cosmos enquiries.
Restrict access to your Cosmos connection key to the server environment and
configure production abuse protection on the public enquiry endpoint.

Source and private recordings from the pre-conversion project are preserved in
the separate verified local ROBOCOPY backup.
