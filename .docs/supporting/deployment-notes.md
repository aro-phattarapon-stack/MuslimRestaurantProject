# Deployment Notes

## Local Development

Requirements for the frontend are Node.js `20.19.0` or a version satisfying Vite
`>=22.12.0`, npm, and a modern web browser. The repository does not pin Node or
npm with a `packageManager` or `engines` field.

```bash
npm install
npm run dev
```

The development command starts Vite and normally opens the app on
`http://localhost:5173`. The port can change when `5173` is already in use.

To verify or preview a production build:

```bash
npm run build
npm run preview
```

The build creates `dist/`, and the preview server normally uses
`http://localhost:4173`. Neither command is a production deployment.

## Production Deployment

No hosting provider or production environment is approved or configured in the
repository. The deployable unit is the static Vite frontend in `dist/`.

Before production deployment, the project owner must record and approve:

- Hosting provider and account
- Build command and Node/npm versions
- Published output directory (`dist/`)
- Production domain and TLS management
- Deployment owner and release approver
- Environment variable requirements
- Rollback procedure
- Health monitoring and log/incident handling
- Cache, redirect, and SPA routing configuration

The repository does not contain a deployment workflow or infrastructure code.
Do not publish `dist/` as production until the deployment checklist is approved.

## Environment and Secrets

No `.env` file is required for the current browser-only frontend. The source
does not read `import.meta.env`, `process.env`, or dotenv configuration.
`CLOUD_LLM_API_KEY`, `CLOUD_LLM_MODEL`, Google OAuth, PostgreSQL, session,
and email values in `.env.example` describe future integrations only.

No secret should be committed. Before implementing a real backend integration,
document server-only environment access, secret rotation, and allowed origins.
Do not expose API keys or session secrets in Vite variables.

## Data and Privacy

The frontend is client-only and uses bundled restaurant records from
`src/services/restaurants.js`. Prototype account records, the active browser
session, favorites, and language preference are stored in `localStorage`.

Before production use, review the dataset provenance and permissions and define
privacy retention, deletion, consent, account security, and incident procedures.
Browser-local plaintext prototype passwords must not be represented as a
secure account system or used for real user credentials.
