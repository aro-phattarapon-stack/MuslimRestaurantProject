# Halal Chiang Rai

Halal Chiang Rai is a mobile-first React prototype for discovering halal
restaurants in Chiang Rai. The current app focuses on local restaurant search,
details, favorites, and Thai/English UI.

> This is a prototype. Restaurant information is bundled with the frontend and
> should be confirmed with the restaurant before visiting.

## Current Features

- Home page with area shortcuts and a local recommendation form
- Restaurant search by name, menu item, area, cuisine, and halal-related text
- Home recommendations using area, cuisine, and budget phrases
- Area shortcuts for MFU, Chiang Rai city, Mae Sai, and other Chiang Rai districts
- Ranked restaurant cards with cuisine, area, price, opening hours, and verified status
- Restaurant detail bottom sheet with description, location, hours, menu, prices,
  favorite, and Google Maps directions actions
- Favorites for signed-in prototype users
- Local browser sign-up/sign-in flow
- Thai/English language switching
- Responsive layout with a 480px app shell, 320px minimum viewport target, and
  safe-area-aware bottom navigation

## Not Implemented Yet

The current frontend does not yet include a backend/API, live GPS or map view,
mosque/prayer-place data, restaurant-owner portal, certificate uploads,
community reviews, issue reporting, or server-side accounts and consent/audit
logging. These are documented as future requirements rather than current
features.

## Technology

- **Frontend:** React, Vite, JSX, CSS
- **Icons:** lucide-react
- **Data:** bundled JavaScript dataset in `src/features/restaurants/data/`
- **Prototype persistence:** browser `localStorage`
- **Directions:** Google Maps URL opened from restaurant coordinates/address

## Requirements

- Node.js 20 or later
- npm

## Install and Run

```bash
git clone <repository-url>
cd MuslimRestaurantProject
npm install
npm run dev
```

Open the URL shown by Vite, usually `http://localhost:5173`.

```bash
npm run build       # Production build
npm run preview     # Preview the production build
```

## Project Structure

```text
src/
├── App.jsx                         # App state and tab-based view switching
├── components/                     # Header, navigation, auth, and search UI
├── features/restaurants/           # Data, ranking, cards, list, and details
├── pages/                          # Home, Search, Favorites, Account, About
├── i18n.js                         # Thai/English translations
└── styles/                         # Global design tokens and layout
data_pipeline/                     # Optional source-data cleaning/export scripts
.docs/                              # Requirements and design documentation
```

## Current User Flow

1. Open Home and optionally use the local recommendation form or choose an area.
2. Open Search and enter a restaurant, menu item, or area. Area and
   recommendation preferences selected on Home carry into the results.
3. Select a restaurant card to open its detail sheet.
4. Save the restaurant after signing in, or open directions in Google Maps.

## Documentation

- [Current requirements and implementation status](.docs/01-requirements/spec.md)
- [Backlog and current scope](.docs/01-requirements/backlog.md)
- [Feature list](.docs/02-design/feature-list.md)
- [Prototype screens](.docs/02-design/prototype.md)
- [User journey](.docs/02-design/user-journey.md)
- [Architecture diagrams](.docs/02-design/diagrams.md)
- [Implemented visual system](.docs/02-design/design-system.md)

## User Roles

The current prototype has one usable end-user flow: **Muslim User**.
**Restaurant Owner** and **System Admin** are future roles reserved for the
backend/operations phase.

## Data Pipeline

The `data_pipeline/` directory contains Python scripts for collecting, cleaning,
merging, enriching, and exporting restaurant data. The Vite app currently reads
the prepared JavaScript dataset under `src/features/restaurants/data/`; running
the pipeline is not required to start the frontend.
