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
- **Data:** bundled JavaScript dataset in `src/services/restaurants.js`
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
├── components/                     # Shared UI and restaurant components
├── pages/                          # Home, Search, Favorites, Account, About
├── services/                       # Bundled restaurant data
├── utils/                          # Search, maps, and localization helpers
└── assets/                         # Brand image and global styles
data_pipeline/                     # Optional source-data cleaning/export scripts
.docs/                              # DISCOVER, BUILD, TEST, DELIVER documentation
```

## Current User Flow

1. Open Home and optionally use the local recommendation form or choose an area.
2. Open Search and enter a restaurant, menu item, or area. Area and
   recommendation preferences selected on Home carry into the results.
3. Select a restaurant card to open its detail sheet.
4. Save the restaurant after signing in, or open directions in Google Maps.

## Documentation

- [Company charter](.docs/discover/company-charter.md)
- [User research](.docs/discover/user-research.md)
- [Current requirements and implementation status](.docs/discover/requirements.md)
- [Backlog and current scope](.docs/discover/product-backlog.md)
- [Architecture](.docs/design/architecture.md)
- [Feature list](.docs/design/feature-list.md)
- [Prototype screens](.docs/design/prototype.md)
- [User journey](.docs/design/user-journey.md)
- [Architecture diagrams](.docs/design/diagrams/diagrams.md)
- [Implemented visual system](.docs/design/design-system.md)
- [Test plan](.docs/testing/test-plan.md)
- [Test results](.docs/testing/test-results.md)
- [Final case study](.docs/final/case-study.md)
- [AI logic](.docs/final/ai-logic.md)
- [Supporting documents](.docs/supporting/)

## User Roles

The current prototype has one usable end-user flow: **Muslim User**.
**Restaurant Owner** and **System Admin** are future roles reserved for the
backend/operations phase.

## Data Pipeline

The `data_pipeline/` directory contains Python scripts for collecting, cleaning,
merging, enriching, and exporting restaurant data. The Vite app currently reads
the prepared JavaScript dataset under `src/services/`; running
the pipeline is not required to start the frontend.
