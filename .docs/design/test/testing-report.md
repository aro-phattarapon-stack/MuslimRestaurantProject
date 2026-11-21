# Testing Report

## 1. Testing Overview

This report documents a source code review and independent test execution for
the Halal Chiang Rai React prototype. The repository contains no existing
JavaScript test runner or automated test script.

Vitest and Testing Library were added as lightweight test tooling for the
current React and Vite environment. Tests were kept outside production source
code under `test/unit/`.

The production implementation remains browser-local:

- Restaurant records are bundled in `src/services/restaurants.js`.
- Search and ranking are implemented in `src/utils/recommend.js`.
- Authentication and favorites use browser `localStorage`.
- There is no verified backend API, database connection, OAuth flow, email
  provider, or external LLM call.

## 2. Source Code Structure

| Path | Responsibility |
|---|---|
| `src/main.jsx` | Creates the React root and renders `src/App.jsx`. |
| `src/App.jsx` | Holds tab, search, filter, account, favorite, language, and selected-restaurant state. |
| `src/pages/Home/HomePage.jsx` | Renders the recommendation form, area shortcuts, and featured restaurants. |
| `src/pages/Search/SearchPage.jsx` | Renders the search field, result count, and restaurant list. |
| `src/pages/Favorites/FavoritesPage.jsx` | Renders the favorites collection or sign-in gate. |
| `src/pages/Account/AccountPage.jsx` | Renders the browser-local account view and sign-out control. |
| `src/pages/About/AboutPage.jsx` | Renders project information. |
| `src/components/AuthModal/AuthModal.jsx` | Implements browser-local sign-up and sign-in validation. |
| `src/components/SearchBar/SearchBar.jsx` | Provides query input, submit, and clear controls. |
| `src/components/AiRecommendForm/AiRecommendForm.jsx` | Collects recommendation prompt text; it does not call AI services. |
| `src/components/AiAssistantBox/AiAssistantBox.jsx` | Unwired assistant UI component; it is not imported by the active application. |
| `src/components/BottomNav/BottomNav.jsx` | Provides tab navigation. |
| `src/components/restaurants/RestaurantCard/RestaurantCard.jsx` | Renders restaurant summary and favorite controls. |
| `src/components/restaurants/RestaurantDetail/RestaurantDetail.jsx` | Renders restaurant details and Google Maps/favorite actions. |
| `src/components/restaurants/RestaurantList/RestaurantList.jsx` | Renders cards or an empty-state control. |
| `src/services/restaurants.js` | Exports 267 bundled restaurant records. |
| `src/utils/recommend.js` | Implements normalization, filtering, ranking, zone derivation, and prompt parsing. |
| `src/utils/googleMaps.js` | Builds coordinate or text-based Google Maps URLs. |
| `src/utils/i18n.js` | Provides Thai/English translations and value localization. |
| `data_pipeline/` | Optional offline source collection, SQLite processing, enrichment, and JavaScript export. |

## 3. Core Implementation

### Restaurant browsing by area

`src/App.jsx` stores `zone` in application state. Area buttons call
`onZoneSelect()` with MFU, CITY, MAESAI, or OTHER zone identifiers.
`recommendRestaurants()` derives a restaurant zone from fields such as
`province`, `area`, `district`, and `name`, then filters and sorts results.

### Search

`src/pages/Search/SearchPage.jsx` provides the search interface.
`src/components/SearchBar/SearchBar.jsx` updates `query` in `src/App.jsx`.
`recommendRestaurants()` normalizes text and matches aliases and terms against
name, location, cuisine, description, halal status, price, and menu names.

### Restaurant details

Selecting a restaurant card calls `setSelectedRestaurant()` in `src/App.jsx`.
`RestaurantDetail` renders the selected record and emits favorite and Google
Maps actions. `openGoogleMaps()` in `src/utils/googleMaps.js` uses coordinates
when valid and falls back to a text query.

### Authentication

`AuthModal` validates required fields and password length, normalizes email,
and reads or writes `halal-accounts` in `localStorage`.
Successful operations write `halal-session`. This implementation is a prototype:
passwords are plain text and no server session or OAuth flow exists.

### Favorites

Signed-in users may toggle an ID in `favorites`. `src/App.jsx` persists the
array at `halal-favorites-<email>`. On startup, the app restores both the
browser session and that account's favorites.

### Language switching

`src/App.jsx` stores `halal-language`. `changeLanguage()` updates state and
`localStorage`. `translate()` and `translateValue()` in `src/utils/i18n.js`
resolve UI and domain values.

### Local recommendation logic

`parseRecommendationPrompt()` recognizes supported Thai and English zone,
budget, and cuisine phrases. `src/App.jsx` first handles short exact-name
prompts and then uses the parser and a fallback filter chain. This is
deterministic local behavior, not external generative AI.

## 4. Testing Environment

- Operating system: Linux
- Runtime: Node.js 24.11.1
- npm: 11.6.2
- Vite: 8.3.5
- Vitest: 5.1.1
- Testing Library React: 16.3.3
- jsdom: 31.0.1
- Existing automated tests: none before this work

Test files:

- `test/unit/recommend.test.js`
- `test/unit/auth.test.jsx`
- `test/unit/app.test.jsx`
- `test/setup.js`

Test configuration is in `vite.config.js`, and `npm test` is in `package.json`.

## 5. Test Strategy

Tests prioritize the following:

1. Bundled data size and basic search behavior.
2. Thai and English aliases and prompt parsing.
3. Empty input and budget boundary behavior.
4. Open-now limitation and unsupported preference behavior.
5. Prototype registration, login validation, and browser storage.
6. Language persistence across React remounts.
7. Search UI input and matching cards.
8. Favorites add/remove behavior and persistence across remount.
9. Restaurant detail modal rendering.
10. Google Maps URL construction.

Manual browser testing remains appropriate for responsive layout, keyboard
navigation, browser reload behavior, and Google Maps navigation.

## 6. Test Cases

| Field | Description |
|---|---|
| Test Case ID | TC-REC-001 |
| Feature | Bundled restaurant data |
| Test Scenario | Confirm the exported source dataset is complete |
| Preconditions | Test environment can import `src/services/restaurants.js` |
| Test Steps | Import the module and inspect `restaurants.length` |
| Test Input | None |
| Expected Result | Exactly 267 records |
| Actual Result | `267` records returned |
| Status | PASS |

| Field | Description |
|---|---|
| Test Case ID | TC-REC-002 |
| Feature | Empty search |
| Test Scenario | Empty query with all zones and 2000 budget |
| Preconditions | Bundled records are available |
| Test Steps | Call `recommendRestaurants()` with empty query and all zones |
| Test Input | `{ query: "", zone: "ALL", cuisine: "ทั้งหมด", maxBudget: 2000 }` |
| Expected Result | All 267 records are candidates |
| Actual Result | 267 records returned |
| Status | PASS |

| Field | Description |
|---|---|
| Test Case ID | TC-REC-003 |
| Feature | English restaurant-name search |
| Test Scenario | Search by numeric English name text |
| Preconditions | Bundled records are available |
| Test Steps | Call `recommendRestaurants()` with query `786` |
| Test Input | `786` |
| Expected Result | A record named with `786` is included |
| Actual Result | `786 Islamic Restaurant` was included |
| Status | PASS |

| Field | Description |
|---|---|
| Test Case ID | TC-REC-004 |
| Feature | Thai and English location search |
| Test Scenario | Filter Mae Sai by English zone and Thai query |
| Preconditions | Bundled records are available |
| Test Steps | Request MAESAI zone and separately query `แม่สาย` |
| Test Input | `MAESAI`, `แม่สาย` |
| Expected Result | Mae Sai records are available and retained |
| Actual Result | Both checks returned matching records |
| Status | PASS |

| Field | Description |
|---|---|
| Test Case ID | TC-REC-005 |
| Feature | Open-now filter |
| Test Scenario | Request live open-now filtering |
| Preconditions | Bundled records are available |
| Test Steps | Call `recommendRestaurants()` with `openNow: true` |
| Test Input | `{ openNow: true }` |
| Expected Result | Implementation limitation is reproducible |
| Actual Result | Zero records returned |
| Status | PASS, with known limitation |

| Field | Description |
|---|---|
| Test Case ID | TC-REC-006 |
| Feature | Recommendation prompt parsing |
| Test Scenario | Parse Thai and English location, budget, and cuisine |
| Preconditions | Parser is available |
| Test Steps | Call `parseRecommendationPrompt()` twice |
| Test Input | `ร้านใกล้แม่สาย งบไม่เกิน 150 บาท กาแฟ`; `Mae Sai noodle under 200 baht` |
| Expected Result | Appropriate zone, budget, and cuisine values |
| Actual Result | Thai and English values were parsed as expected |
| Status | PASS |

| Field | Description |
|---|---|
| Test Case ID | TC-REC-007 |
| Feature | Budget boundary |
| Test Scenario | Filter a minimum-price value at the budget boundary |
| Preconditions | A synthetic two-record dataset is available |
| Test Steps | Call the recommender with a 100-baht budget |
| Test Input | Minimum prices `80` and `300` |
| Expected Result | Only the 80-baht record remains |
| Actual Result | Only `Low price` remained |
| Status | PASS |

| Field | Description |
|---|---|
| Test Case ID | TC-AUTH-001 |
| Feature | Sign-up input validation |
| Test Scenario | Submit an empty registration form |
| Preconditions | `AuthModal` is rendered in sign-up mode |
| Test Steps | Submit without filling fields |
| Test Input | Empty name, email, and password |
| Expected Result | Required-field error is displayed |
| Actual Result | `errorRequired` alert was rendered |
| Status | PASS |

| Field | Description |
|---|---|
| Test Case ID | TC-AUTH-002 |
| Feature | User registration |
| Test Scenario | Register and create browser session |
| Preconditions | Browser local storage is empty |
| Test Steps | Enter name, email, password and submit |
| Test Input | Local test values supplied by the test, not credentials from the repository |
| Expected Result | Account and session are written and callback receives normalized identity |
| Actual Result | `halal-session` and account state were created |
| Status | PASS |

| Field | Description |
|---|---|
| Test Case ID | TC-AUTH-003 |
| Feature | Duplicate registration and invalid login |
| Test Scenario | Reject duplicate email and incorrect password |
| Preconditions | An existing account is in `halal-accounts` |
| Test Steps | Attempt duplicate sign-up and then invalid sign-in |
| Test Input | Existing and incorrect test values |
| Expected Result | Duplicate and invalid-credential alerts appear |
| Actual Result | Both alerts rendered |
| Status | PASS |

| Field | Description |
|---|---|
| Test Case ID | TC-UI-001 |
| Feature | Language switching |
| Test Scenario | Switch to English and restore after app remount |
| Preconditions | Browser storage is empty |
| Test Steps | Click the language control, unmount, and render `App` again |
| Test Input | Thai to English switch |
| Expected Result | English is stored and language control uses English text after remount |
| Actual Result | `halal-language` was `en`; remounted UI showed English |
| Status | PASS |

| Field | Description |
|---|---|
| Test Case ID | TC-UI-002 |
| Feature | Search interaction |
| Test Scenario | Enter a restaurant name in the Search page |
| Preconditions | Application is loaded |
| Test Steps | Open Search and change the search input |
| Test Input | `786` |
| Expected Result | `786 Islamic Restaurant` appears in results |
| Actual Result | Matching card rendered |
| Status | PASS |

| Field | Description |
|---|---|
| Test Case ID | TC-FAV-001 |
| Feature | Favorites add/remove and persistence |
| Test Scenario | Save a favorite, remove it, and remount the app |
| Preconditions | A local session and ID `1` are present |
| Test Steps | Open Favorites, remove the saved card, unmount, and remount |
| Test Input | Restaurant ID `1` |
| Expected Result | Storage becomes an empty array and card is absent after remount |
| Actual Result | Storage changed to `[]` and card remained absent |
| Status | PASS |

| Field | Description |
|---|---|
| Test Case ID | TC-DETAIL-001 |
| Feature | Restaurant detail modal |
| Test Scenario | Open and verify restaurant detail information |
| Preconditions | Restaurant cards are rendered |
| Test Steps | Click `27%CAFE` and inspect the dialog |
| Test Input | Restaurant ID `1` |
| Expected Result | Dialog shows name and directions control |
| Actual Result | Name and directions control were present |
| Status | PASS |

| Field | Description |
|---|---|
| Test Case ID | TC-MAP-001 |
| Feature | Google Maps URLs |
| Test Scenario | Build coordinate and text fallback URLs |
| Preconditions | Google Maps helper is available |
| Test Steps | Call coordinate and invalid-coordinate cases |
| Test Input | Valid Chiang Rai coordinates; missing coordinates |
| Expected Result | Coordinate directions or text search URL is returned |
| Actual Result | Coordinate and text fallback URLs were constructed as expected |
| Status | PASS |

| Field | Description |
|---|---|
| Test Case ID | TC-E2E-001 |
| Feature | Real browser reload and responsive UI |
| Test Scenario | Verify reload persistence and mobile layout in a browser |
| Preconditions | A browser and local test account are available |
| Test Steps | Register, save favorites, switch language, reload, and inspect the 320-480px layout |
| Test Input | Developer-selected non-sensitive local values |
| Expected Result | UI state and browser data persist within the browser profile |
| Actual Result | Not executed as Playwright or browser automation |
| Status | BLOCKED |

## 7. Test Execution Results

### Automated execution

```text
npm test -- --reporter=dot

Test Files  4 passed (4)
Tests       17 passed (17)
Duration    approximately 8 seconds
```

```text
npm run build

vite build
✓ 1966 modules transformed
✓ built in 435ms
```

Commands used:

```bash
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom
npm test -- --reporter=dot
npm run build
```

The initial automated run found two test expectation failures:

- One assertion used `Language: ไทย` after switching to English, but the actual
  accessible label is `Language: Thai`.
- One detail assertion matched both the card heading and detail heading.
  It was corrected to scope the assertion to the dialog.

The corrected run passed all 14 tests. Three Google Maps URL cases were then
added and the complete suite passed all 17 tests. No production behavior was
changed to make a failing test pass.

## 8. Failed or Blocked Tests

### Corrected test failures

- TC-UI-001 initially failed because of an incorrect translated label
  expectation.
- TC-DETAIL-001 initially failed because the assertion was not scoped to the
  modal.

Both failures were test assertion issues and were corrected. They are not final
failing tests.

### Blocked tests

- TC-E2E-001 requires a browser automation tool or manual browser execution
  and was not executed.
- Live Google Maps navigation was not automated because it opens an external
  service.
- Backend, OAuth, email, and PostgreSQL tests are not applicable because those
  implementations do not exist.

## 9. Known Issues and Limitations

1. `openNow: true` always rejects all records; live opening-time filtering is
   not implemented.
2. `halalOnly` and `requiredAmenities` are not actual filters in
   `recommendRestaurants()`.
3. Opening hours may be generated from restaurant ID sequences rather than
   source-provided values.
4. Prototype passwords are stored as plain text in `localStorage`.
5. Favorites and accounts do not synchronize across devices or browser profiles.
6. The UI contains Gemini-related localization text, but no Gemini or other LLM
   code call exists.
7. `AiAssistantBox` is present but not wired into the active application.
8. There is no live GPS, embedded map, backend, OAuth, or email implementation.
9. The pipeline is separate and not automatically reflected in
   `src/services/restaurants.js`.
10. No browser automation framework is installed for real reload and external
    navigation testing.

## 10. Conclusion

The reviewed implementation is a browser-local React prototype with bundled
restaurant data, deterministic search and ranking, browser-local authentication,
favorites, and localization. The initial test framework was absent, so
lightweight Vitest and Testing Library tooling was added separately from
production code.

All 17 executed automated tests passed, and the production build completed
successfully. The suite verifies the 267-record bundle, Thai and English
search concepts, prompt parsing, empty and budget behavior, authentication
validation, language persistence, favorites persistence across app remount,
search rendering, and detail rendering.

Real browser reload automation, external Google Maps navigation, and complete
responsive browser testing still need an additional browser test framework or
manual QA execution. Backend and external-service tests are not applicable
until those features are implemented.
