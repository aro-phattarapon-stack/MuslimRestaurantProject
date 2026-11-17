# Proposal: Halal Chiang Rai

## Current Product Direction

Halal Chiang Rai is a mobile-first tool for discovering halal restaurants in
Chiang Rai. The working implementation is a React/Vite frontend prototype that
uses a bundled restaurant dataset. It currently focuses on fast search,
area-based discovery, restaurant details, favorites,
and Google Maps directions.

The prototype is intentionally useful without a backend: users can browse as
guests, while account creation is only required to save favorites. Account,
session, language, and favorite data are stored in the browser for development
purposes.

## Problem

Muslim residents, students, and travelers often need to check restaurant names,
locations, opening hours, menus, prices, and halal-related information across
multiple sources. A focused restaurant directory can reduce that search effort
and make the available information easier to compare.

The current app addresses this problem with:

- Search across restaurant names, menu items, areas, cuisine, descriptions, and
  halal-related text
- Area shortcuts for MFU, Chiang Rai city, Mae Sai, and other districts
- Local recommendation prompts for area, cuisine, and budget
- Restaurant detail sheets with menu, price, opening hours, location, and
  directions
- A visible disclaimer asking users to confirm halal status with the restaurant

## Target Users

### Primary: Muslim User

- Residents who want to find restaurants near familiar areas
- Students who need affordable options near Mae Fah Luang University
- Domestic and international visitors who need concise restaurant information

### Future Secondary Roles

- **Restaurant Owner:** maintain listing information and submit verification
  documents through a future backend portal
- **System Admin:** review records, manage verification, and moderate reports
  through a future operations interface

## Scope Boundary

The current prototype does not yet provide live GPS, an interactive map,
mosque/prayer data, certificate evidence, community reviews, issue reporting,
owner/admin portals, trip planning, or server-side compliance storage. These
remain future product directions and are tracked in the requirements and
backlog documents.

## Expected Outcome

In the current phase, a Muslim User can find and compare bundled Chiang Rai
restaurant records in fewer steps, inspect the available details, save a
restaurant locally, and open directions. Future phases can add verified
provenance and operational workflows once a backend is introduced.
