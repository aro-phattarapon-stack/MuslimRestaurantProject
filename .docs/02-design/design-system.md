# Design System — Current Halal Chiang Rai UI

This document reflects the implemented CSS in
`src/styles/global.css` and page/component styles. The older emerald/sand
specification is retained only as a future design direction; the current UI
uses a pink/plum palette.

## 1. Layout

- App shell: `max-width: 480px`, centered on wider viewports
- Small-screen minimum target: `320px`
- Main content horizontal padding: `16px` (reduced to `12px` below 360px)
- Fixed bottom navigation with safe-area padding
- Restaurant details use a bottom-sheet modal on mobile and a centered modal on
  wider screens

## 2. Implemented Tokens

The names below are CSS custom properties from `global.css`.

| Token | Current value | Usage |
|---|---|---|
| `--emerald-600` | `#fda5dd` | Selected/brand-compatible accent |
| `--emerald-700` | `#feacdc` | Detail icon and accent surfaces |
| `--emerald-800` | `#f741a5` | Focus/primary accent |
| `--sand-50` | `#fffaf8` | App canvas |
| `--sand-100` | `#fff1f5` | Page background |
| `--sand-200` | `#f5dce5` | Borders/dividers |
| `--surface-0` | `#fffdfd` | Cards and surfaces |
| `--ink-800` | `#302536` | Primary text |
| `--ink-600` | `#746575` | Secondary text |
| `--ink-400` | `#b7a6b1` | Muted text |
| `--pastel-mint` | `#ffc2e1` | Pastel accent |
| `--pastel-peach` | `#ffe1d5` | Secondary pastel accent |
| `--pastel-sky` | `#fcb9de` | Amenity-compatible accent |
| `--radius-sm/md/lg/full` | `8/12/20/999px` | Components |
| `--shadow-1/2` | CSS shadow values | Cards and floating surfaces |

Several component styles currently use direct color values in addition to
tokens. This accurately documents the present implementation; future cleanup
can consolidate them into a single token layer.

## 3. Typography

- Primary font: `Noto Sans Thai`
- Latin fallback: `DM Sans`
- Base size: `15px`
- Body line-height: `1.5`
- Page titles: generally 28px
- Restaurant detail title: 24px
- Buttons and labels use semibold/bold weights

## 4. Component Rules

| Component | Current behavior |
|---|---|
| Search bar | 52px pill-shaped form with 44px input, submit, and clear controls |
| Search page | Query field, result count, and ranked restaurant cards |
| Restaurant card | Keyboard-accessible article with favorite button |
| Verified badge | Shown only for records with `verified: true` |
| Detail actions | Save and Google Maps directions; 52px minimum height |
| Bottom navigation | Four tabs: Home, Search, Favorites, Account |
| Auth modal | Local browser sign-in/sign-up with validation messages |
| Empty state | Explains no matches and offers a reset action |

## 5. Accessibility Baseline

- Visible `:focus-visible` outline for buttons, fields, links, and role buttons
- Restaurant cards support Enter and Space keyboard activation
- Icon controls have accessible labels
- Status messages use semantic `role="alert"` or `role="status"` where needed
- Reduced-motion media query disables or shortens transitions/animations
- Search controls are 44px; primary controls use 46px; detail actions use 52px
- The header is 72px on standard mobile, 68px below 430px, and the brand icon
  scales from 62px to 54px below 430px and 46px below 360px
- The app shell is 480px wide; at 600px and above the page adds 24px outer
  spacing and the shell uses a 24px lower radius
- The bottom navigation is 68px plus the device safe-area inset, with 52px
  navigation items

## 6. Future Design Work

When maps, prayer places, certificate provenance, owner/admin workflows, or
reviews are implemented, extend this system with their states and do not claim
those states are available in the current prototype.
