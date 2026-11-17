# Product Backlog — Halal Chiang Rai

**Status:** aligned with the current frontend prototype

## Actors

- **Muslim User** — searches, views, saves, and navigates to restaurants
- **Restaurant Owner** — future role for maintaining listings and certificates
- **System Admin** — future role for verification and moderation

## Implemented Stories

### US01 — Browse by area

As a Muslim User, I want to choose a Chiang Rai area so that I can start with
restaurants relevant to my visit.

**Acceptance criteria**

- Home shows MFU, Chiang Rai city, Mae Sai, and other Chiang Rai area shortcuts.
- Selecting an area opens Search with the selected area applied to matching logic.

### US02 — Search restaurants

As a Muslim User, I want to search restaurant names, dishes, and areas so that
I can find a suitable restaurant quickly.

**Acceptance criteria**

- Search is updated as the query changes.
- Search terms are matched against restaurant name, location, cuisine,
  description, price text, halal status, and menu item names.
- Thai and English aliases are supported for common terms such as noodles,
  coffee, desserts, halal, MFU, and Mae Sai.

### US03 — Manual filters removed from Search

The Search page no longer exposes separate cuisine and budget controls. Users
search directly with text, while the Home recommendation prompt can still
interpret area, cuisine, and budget preferences.

### US04 — View restaurant details

As a Muslim User, I want to inspect a restaurant before visiting.

**Acceptance criteria**

- A card opens a detail sheet.
- The sheet shows cuisine, price, description, area, opening hours, menu and
  prices when present, favorite action, and Google Maps directions.

### US05 — Save favorites

As a Muslim User, I want to save restaurants for later.

**Acceptance criteria**

- Saving requires a local prototype account.
- Favorites can be viewed from the Favorites tab.
- Favorites are stored per account in this browser.

### US06 — Use the app in two languages

As a Muslim User, I want to switch between Thai and English.

**Acceptance criteria**

- The header language control switches between Thai and English.
- The selected language is persisted in this browser.

### US07 — Use local recommendation prompts

As a Muslim User, I want to describe an area, cuisine, or budget on Home.

**Acceptance criteria**

- The Home prompt parses supported local phrases into area, cuisine, and budget
  preferences for ranked recommendations.
- A short prompt matching a restaurant name opens Search with that query.
- This is a local parser; no external AI service is currently connected.

## Deferred Stories

- **US08 — Live map and nearby facilities:** GPS, map tiles, distance, mosques,
  musalla, and prayer schedules.
- **US09 — Halal verification provenance:** certificate files, issuer, expiry,
  and clear verified/unverified states.
- **US10 — Community reviews:** authenticated ratings, text, and photos.
- **US11 — Restaurant-owner portal:** claim/edit listings and submit documents.
- **US12 — Issue reporting:** user reports routed to admin moderation.
- **US13 — Trip planner:** multi-stop routes and total distance.

## Priority

| Priority | Current scope |
|---|---|
| Must | US01, US02, US04–US06 |
| Should | US08–US12 after a backend is introduced |
| Could | US07 improvements and richer recommendation logic |
| Won’t in current prototype | Live maps, reviews, owner/admin workflows, trip planning |
