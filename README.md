# Halal Chiang Rai

Halal Chiang Rai is a mobile-first React prototype for discovering halal and
Muslim-friendly restaurants in Chiang Rai province. It combines local
restaurant search, ranked recommendations, saved favorites, and Thai/English
interface text.

> Restaurant information in this prototype is bundled with the frontend. Confirm
> halal status and opening information with the restaurant before visiting.

## Current Features

The following features are implemented in the current source:

- Search by restaurant name, menu text, district, area, province, cuisine,
  and halal-related text.
- Filter by zone, cuisine, and maximum budget.
- Rank local restaurant matches using name, zone, cuisine, and verification
  signals.
- View restaurant details, menus, prices, opening hours, and Google Maps
  directions.
- Use area shortcuts for MFU, Chiang Rai city, Mae Sai, and other districts.
- Save restaurants as favorites after prototype sign-in.
- Register and sign in through a browser-local account interface.
- Switch between Thai and English interface text.
- Use a responsive 480px app shell with fixed bottom navigation.

The recommendation form is presented as an AI feature, but its behavior is
currently local and rule-based. It does not call an external AI provider.

## Planned Features

The following features are not implemented in the current frontend:

- Backend API or server-side application.
- PostgreSQL/PostGIS database access.
- Google OAuth.
- Server-side account sessions or secure password storage.
- Email delivery.
- External LLM or generative AI integration.
- Live GPS, live opening status, or embedded map rendering.
- Restaurant-owner or system-administrator workflows.
- Certificate uploads, community reviews, issue reporting, consent storage,
  or access-log management.

Documentation and `.env.example` may describe future integrations. Their
presence does not mean that the integrations are operational.

## Technology

- React
- Vite
- JavaScript and JSX
- CSS
- lucide-react
- Browser `localStorage`
- Bundled JavaScript restaurant data
- Optional Python 3 data pipeline with SQLite

## Prerequisites

### Frontend

- Node.js `20.19.0` or a version satisfying Vite `>=22.12.0`
- npm
- A modern web browser

Node and npm are not pinned by a `packageManager` or `engines` field in
`package.json`. The locked Vite package requires
`^20.19.0 || >=22.12.0`.

Verify the installed versions:

```bash
node --version
npm --version
```

The npm version is not pinned by this repository. Use a reasonably current npm
release compatible with `package-lock.json` lockfile version 3.

### Optional data pipeline

Running the Python pipeline additionally requires:

- Python 3
- `pip`
- A network connection for source collection and enrichment

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd MuslimRestaurantProject
```

Replace `<repository-url>` with the repository URL used by your team.

### 2. Install frontend dependencies

```bash
npm install
```

This installs the dependencies recorded in `package.json` and
`package-lock.json`.

### 3. Start the development server

```bash
npm run dev
```

Open the URL printed by Vite. With the default configuration, this is usually:

```text
http://localhost:5173
```

If port `5173` is busy, Vite may choose the next available port and print the
correct URL in the terminal.

Stop the server with `Ctrl+C`.

## Environment Configuration

No `.env` file is required to run the current frontend.

The source code does not read `import.meta.env`, `process.env`, or a dotenv
configuration file. The bundled restaurant records and prototype account data
run entirely in the browser.

`.env.example` contains placeholders for planned LLM, Google OAuth, PostgreSQL,
session, and email integrations. Do not copy or configure it as a requirement
for the current application. The values are documentation placeholders, and
no corresponding implementation was found in `src/`.

Do not commit real credentials or secret values.

## Test Account and Manual Testing

This repository does not contain a predefined or seeded test account.

To create a local prototype account:

1. Start the app and open **Account**, or try to save a restaurant.
2. Choose **Sign up**.
3. Enter a display name, email address, and a password of at least six
   characters.
4. Submit the form.
5. Use **Sign in** later from the same browser profile with the same email and
   password.

There are no credentials provided by the repository. Use values of your own
choice for local testing.

Account data is stored in these browser `localStorage` entries:

- `halal-accounts`: prototype account records
- `halal-session`: the active browser-local account
- `halal-favorites-<email>`: restaurant IDs saved by that account
- `halal-language`: the selected Thai or English preference

Account data is not shared between browser profiles or devices. Clearing site
data removes it. Private or isolated browser sessions can prevent it from
persisting.

Prototype authentication limitations:

- Passwords are stored as plain text in browser storage.
- There is no password hashing or server-side authentication.
- There is no server session, cookie, expiry, authorization, password recovery,
  or email verification.
- Browser storage can be changed or removed by the user.
- Do not use real passwords or sensitive personal data in this prototype.

The repository has no configured automated test script or test-runner
dependency. Use the manual browser flows and acceptance criteria in
[the test plan](.docs/testing/test-plan.md).

## Available Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create the production frontend in `dist/`. |
| `npm run preview` | Serve the generated `dist/` build locally for verification. |

For example:

```bash
npm run build
npm run preview
```

The preview command normally serves the build at `http://localhost:4173`,
depending on availability.

There is no `npm test` script in the current `package.json`.

## Project Structure

```text
.
├── src/
│   ├── App.jsx                         # Application state and tab routing
│   ├── main.jsx                        # React entry point
│   ├── assets/                         # Brand and image assets
│   ├── components/
│   │   ├── AiRecommendForm/
│   │   ├── AiAssistantBox/
│   │   ├── AuthModal/
│   │   ├── BottomNav/
│   │   ├── SearchBar/
│   │   └── restaurants/
│   │       ├── RestaurantCard/
│   │       ├── RestaurantDetail/
│   │       └── RestaurantList/
│   ├── pages/
│   │   ├── About/
│   │   ├── Account/
│   │   ├── Favorites/
│   │   ├── Home/
│   │   └── Search/
│   ├── services/
│   │   └── restaurants.js              # Bundled restaurant records
│   └── utils/
│       ├── googleMaps.js               # Google Maps URL helper
│       ├── i18n.js                     # Thai/English translations
│       └── recommend.js                # Local filtering and ranking
├── data_pipeline/                      # Optional Python/SQLite data tooling
├── .docs/                              # Project discovery and delivery documents
├── dist/                               # Generated production build
├── package.json
├── package-lock.json
└── vite.config.js
```

## Troubleshooting

### Node.js version errors

Check the installed version:

```bash
node --version
```

Use Node.js `20.19.0` or newer in the supported range, or a Node.js `22.12.0`
or newer release.

### npm dependency installation failures

Remove only the generated dependency directory and reinstall:

```bash
rm -rf node_modules
npm install
```

Do not use `npm audit fix --force`; it can introduce unrelated dependency
changes.

If installation fails because of Node compatibility, first switch to a
supported Node.js version and then run `npm install` again.

### Port already in use

Stop the process already using port `5173`, or allow Vite to print a different
port:

```bash
npm run dev -- --host 0.0.0.0
```

Open the URL Vite prints rather than assuming `5173` is available.

### Development server does not start

From the repository root, verify that the package files and entry files exist:

```bash
ls package.json vite.config.js src/main.jsx src/App.jsx
npm run dev
```

Check terminal error text for missing dependencies or unsupported Node.js
versions. Reinstall dependencies only after switching to a compatible Node.js
release.

## Data Pipeline

`data_pipeline/` contains optional Python scripts for collecting, cleaning,
merging, enriching, and exporting restaurant data.

Its main steps are controlled by:

```bash
cd data_pipeline
python run_pipeline.py
```

The pipeline writes source and merged data to `data_pipeline/halal.db` and
exports a JavaScript module under `data_pipeline/results/restaurants.js`.
It is separate from the React build.

Install the declared Python packages when pipeline work is needed:

```bash
python -m pip install -r data_pipeline/requirements.txt
```

Some enrichment scripts perform live network access to Overpass, Nominatim,
or Wongnai and may be blocked or rate-limited. `halal.db` is SQLite, not
PostgreSQL.

`BeautifulSoup` is imported by `enrich_wongnai_free.py`, but
`beautifulsoup4` is not explicitly listed in the current
`data_pipeline/requirements.txt`. If that pipeline script reports a missing
`bs4` module, install `beautifulsoup4` explicitly after confirming the team's
preferred package setup:

```bash
python -m pip install beautifulsoup4
```

Running the pipeline is not required to start or build the frontend. The app
uses the prepared records in `src/services/restaurants.js`. Pipeline execution
does not automatically update that frontend file.

## Documentation

- [Company charter](.docs/discover/company-charter.md)
- [User research](.docs/discover/user-research.md)
- [Requirements](.docs/discover/requirements.md)
- [Product backlog](.docs/discover/product-backlog.md)
- [System architecture](system-architecture.md)
- [Design architecture](.docs/design/architecture.md)
- [Feature list](.docs/design/feature-list.md)
- [Prototype](.docs/design/prototype.md)
- [User journey](.docs/design/user-journey.md)
- [Architecture diagrams](.docs/design/diagrams/diagrams.md)
- [Design system](.docs/design/design-system.md)
- [Test plan](.docs/testing/test-plan.md)
- [Test results](.docs/testing/test-results.md)
- [AI logic](.docs/final/ai-logic.md)
- [User guide](.docs/supporting/user-guide.md)

## Current User Flow

1. Open Home and optionally enter an area, budget, cuisine, or prompt.
2. Open Search and enter a restaurant, menu item, or area.
3. Select a restaurant card to open its details.
4. Sign in or create a browser-local account before saving favorites.
5. Open Google Maps to get directions.
