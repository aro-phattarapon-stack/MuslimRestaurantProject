# Requirements Specification — Halal Chiang Rai

**Status:** Frontend prototype baseline (November 2026)

This specification describes what is implemented in the current repository and
what remains planned. The source of truth for implemented behavior is the code
under `src/`.

## 1. Product Scope

Halal Chiang Rai helps users find halal restaurants in Chiang Rai using a
mobile-first interface. The current release is a client-only prototype with a
bundled restaurant dataset. It provides discovery, search, restaurant
details, favorites, language switching, and Google Maps directions.

## 2. Actors

- **Muslim User** — the only currently supported end-user flow
- **Restaurant Owner** — planned backend role; no owner UI exists yet
- **System Admin** — planned operations role; no admin UI exists yet

## 3. Implemented Functional Requirements

| ID | Current requirement | Evidence in code |
|---|---|---|
| F01 | The app shall show a Home page with area shortcuts and a restaurant list. | `HomePage.jsx`, `App.jsx` |
| F02 | The app shall let users search restaurant names, menu items, areas, and related restaurant text. | `SearchBar.jsx`, `recommend.js` |
| F03 | Manual cuisine and budget controls are removed from Search; query-based search remains available. | `SearchPage.jsx`, `recommend.js` |
| F04 | The app shall support area shortcuts for MFU, Chiang Rai city, Mae Sai, and other Chiang Rai districts. | `restaurants.js`, `HomePage.jsx` |
| F05 | The app shall rank matching results using query, area, cuisine, and verified-status scores. | `recommend.js` |
| F06 | The app shall show restaurant details in a modal/bottom sheet. | `RestaurantDetail.jsx` |
| F07 | Details shall show category, price, description, area, opening hours, menu data when available, and directions. | `RestaurantDetail.jsx` |
| F08 | Signed-in prototype users shall save and remove restaurants from Favorites. | `App.jsx`, `FavoritesPage.jsx` |
| F09 | The app shall provide local browser sign-up/sign-in and sign-out. | `AuthModal.jsx`, `AccountPage.jsx` |
| F10 | The UI shall support Thai and English translations. | `i18n.js` |
| F11 | The Home page shall provide a local prompt parser that converts common area, cuisine, and budget phrases into recommendation preferences. | `App.jsx`, `recommend.js` |

## 4. Planned, Not Implemented

The following requirements remain product backlog items and must not be
represented as available features until implemented:

- Live map, GPS permission, distance calculation, and map/list switching
- Mosque, musalla, prayer timetable, or prayer-facility discovery
- Halal certificate uploads, expiry tracking, or external verification workflow
- Restaurant-owner listing management
- Admin moderation, reports, and audit dashboard
- Community ratings, reviews, and photo uploads
- Multi-stop itinerary planning
- Backend API, PostgreSQL/PostGIS, server-side authentication, consent storage,
  `access_log`, retention controls, and account deletion workflows

## 5. Current Non-Functional Baseline

- Mobile-first layout with a `480px` maximum app shell
- Minimum viewport width target of `320px`
- Responsive behavior for small mobile and wider preview layouts
- Visible focus styles and keyboard activation for restaurant cards
- Four-item fixed bottom navigation: Home, Search, Favorites, Account
- Restaurant details and authentication use modal/sheet interactions
- The current prototype stores account, session, language, and favorites in
  browser `localStorage`; this is not production-grade security

## 6. Current Data and Verification Semantics

Restaurant records are bundled in
`src/features/restaurants/data/restaurants.js`. The app displays a
“Verified” badge only when `restaurant.verified` is true. It does not currently
display certificate evidence, expiry dates, a separate Muslim-Friendly badge,
or an Unverified workflow.

The footer tells users to confirm halal status with the restaurant before use.
This disclaimer is necessary because the prototype is not a certification
authority.

## 7. Traceability

| Area | Current implementation | Planned extension |
|---|---|---|
| Discovery | Home area shortcuts and bundled list | Live map and nearby venues |
| Search | Query-based search and ranked results | More structured filters if product scope expands |
| Details | Local fields, menu, favorites, Google Maps URL | Provenance and certificate records |
| Identity | Browser-only prototype account | Server account and authorization |
| Personalization | Favorites and local prompt parser | Persistent recommendations |
| Operations | No owner/admin UI | Owner portal and admin moderation |
