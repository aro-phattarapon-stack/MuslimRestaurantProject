# Architecture

## Current Implementation

- The client is a React application built and served with Vite.
- `src/main.jsx` mounts `src/App.jsx`.
- App pages and UI components are under `src/pages/` and `src/components/`.
- Restaurant records are bundled in `src/services/restaurants.js`; search and
  recommendation logic is local in `src/utils/recommend.js`.
- The prototype stores account/session, language, and favorites in browser
  `localStorage`.
- Restaurant directions open a Google Maps URL through
  `src/utils/googleMaps.js`.
- No backend API or server-side database is implemented in this repository.

## Planned Architecture

TODO: Record only an approved target architecture. The technologies and
database options in `CLAUDE.md` are design guidance, not evidence of an
implemented backend.

## Open Decisions

- TODO: Select and document any backend and database technology.
- TODO: Document deployment topology and external service dependencies.
- TODO: Trace privacy, consent, access-log, retention, and audit requirements
  from `rule.md` into an approved design.
