# Prototype — Current Executable UI

This document describes the screens that exist in the React application. It
replaces the earlier three-screen map prototype, which described capabilities
not yet present in the code.

## Screen Map

| Screen | Entry | Main content |
|---|---|---|
| Home | Home tab or brand button | Local recommendation form, area shortcuts, featured restaurants |
| Search | Search tab, area shortcut, or recommendation result | Search field, result count, and cards |
| Restaurant detail | Tap a restaurant card | Modal/bottom sheet with restaurant data and actions |
| Favorites | Favorites tab | Sign-in gate or saved restaurant list |
| Account | Account tab after sign-in | Profile, saved count, language switch, sign out |
| About | Available component, not currently exposed by bottom navigation | Project explanation and recommendation note |

## Home

The Home page contains:

- Header-level app navigation from `App.jsx`
- `AiRecommendForm`, a local prompt parser interface
- Four area cards: MFU, Chiang Rai city, Mae Sai, and other districts
- A featured list of restaurants
- A “view all” action that opens Search

The recommendation form is not connected to a remote AI API. It recognizes
supported local phrases and applies recommendation preferences.

## Search

The Search page intentionally contains only the normal search experience:

- Search input for restaurant, menu, or area text
- Result count and ranked search results
- Result count and restaurant cards

The AI recommendation form is not rendered on this page.

## Restaurant Detail

Selecting a card opens a responsive modal sheet. It shows the bundled record's
cuisine, price, description, area, opening hours, menu when available, verified
badge when applicable, save button, and Google Maps directions button.

## Navigation and Responsive Rules

- Fixed bottom navigation has four tabs: Home, Search, Favorites, Account.
- The app shell is `max-width: 480px`; the small-mobile target starts at
  `320px`. At `600px` and above, the page adds `24px` outer spacing.
- The search bar is `52px` high with `44px` input and icon controls. Primary
  actions use `46px`; detail actions use `52px`.
- The bottom navigation is `68px` high plus the device safe-area inset, and
  each navigation item is at least `52px` high.
- Restaurant cards support keyboard Enter/Space activation.

## Not Yet Prototyped

There is no executable map screen, mosque screen, prayer timetable,
certificate-proof screen, owner portal, admin screen, review composer, or
multi-stop trip planner.
