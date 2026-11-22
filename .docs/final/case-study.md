# Halal Chiang Rai: Project Case Study

## 1. Project Overview

**Project name:** Halal Chiang Rai

Halal Chiang Rai is a mobile-first React prototype that helps Muslim residents,
students, and visitors discover restaurants in Chiang Rai province. The
application brings restaurant discovery, search, basic area filtering,
restaurant details, favorites, Thai/English language support, and local
rule-based recommendations into one browser application.

The project targets Muslim users, particularly students and visitors connected
to Chiang Rai. Its intended value is to reduce the effort of finding a
potentially suitable restaurant by presenting bundled restaurant information
and routes through Google Maps.

The current prototype is a source-verified frontend implementation. It does
not provide a certification authority, live restaurant verification, a backend,
or a live database.

## 2. Problem

The project was motivated by a 25-response online questionnaire conducted
among people connected to Chiang Rai. The survey was primarily student-focused:

- 84% studied in Chiang Rai.
- 12% lived in Chiang Rai.
- 4% had visited Chiang Rai occasionally.
- 96% identified themselves as students.

The survey should be interpreted as initial, student-heavy research rather
than a representative study of all Halal food consumers in Chiang Rai.

### Existing behavior

Respondents did not rely on a single restaurant-search platform. Their reported
search channels were:

- Friends or people they know: 18 responses, 72%
- Google Maps: 16 responses, 64%
- TikTok: 11 responses, 44%
- Facebook: 10 responses, 40%

Search time varied: 52% spent 5–10 minutes, 24% spent 10–20 minutes, 16%
spent more than 20 minutes, and 8% spent less than 5 minutes.

### Identified pain points

The survey reported that 76% had experienced difficulties finding Halal
restaurants. The main problems were:

- Difficulty finding nearby restaurants: 15 responses, 60%
- Incomplete or outdated information: 12 responses, 48%
- Searching across multiple sources: 9 responses, 36%
- Unclear Halal information: 6 responses, 24%
- Difficulty finding prayer rooms or facilities: 1 response, 4%

Users considered these details especially important:

- Halal status or certification: 17 responses, 68%
- Menu and prices: 16 responses, 64%
- Restaurant reviews: 13 responses, 52%
- Distance: 12 responses, 48%
- Opening hours: 9 responses, 36%

Respondents also reported interest in:

- Finding nearby restaurants: 20 responses, 80%
- A Halal restaurant map: 18 responses, 72%
- Menu and price information: 18 responses, 72%
- Halal status information: 13 responses, 52%
- Filters: 5 responses, 20%
- Personalized recommendations: 1 response, 4%

Overall, 84% of respondents considered the proposed platform potentially very
helpful, while 12% considered it helpful and 4% were unsure.

These findings show a research-identified opportunity, not proof that every
respondent's need has been solved by the current prototype.

## 3. Project Objectives

The project charter establishes the following objectives:

- Help users browse restaurants by area.
- Search restaurant names, dishes, locations, and related text.
- Present available restaurant details and menus.
- Let users save favorite restaurants in the prototype.
- Support Thai and English interfaces.
- Provide recommendations using local rule-based logic.
- Establish a maintainable foundation for later product and system evaluation.

The current implementation addresses the primary discovery and information
needs through a bundled dataset and browser-side filtering. It does not yet
implement distance calculation, live GPS, certificate provenance, or a
production account system.

## 4. Process

### Research

The team used an online questionnaire to understand Halal food consumption,
search behavior, pain points, desired information, and interest in a
centralized platform. The 25 respondents were connected to Chiang Rai and were
predominantly students.

Open-ended feedback identified additional needs such as more complete coverage,
menu and food detail, accurate locations, updated opening hours, contact
information, English support, delivery options, and public transportation
information.

### Planning

The charter assigned five roles:

- Project Owner
- Tech Lead
- AI Lead
- UX/UI Designer
- Tester

Requirements and backlog work focused on:

- Browsing by area
- Restaurant search
- Viewing details
- Saving favorites
- Thai/English language switching
- Local recommendation prompts

The backlog identified live maps, certificate provenance, reviews, owner
tools, issue reporting, trip planning, and backend services as deferred work.

### Design

The UI uses a mobile-first React layout with a maximum app shell width of
480px, a 320px minimum viewport target, keyboard-accessible restaurant cards,
and fixed bottom navigation. The design includes Home, Search, Favorites,
Account, and About views.

Restaurant details are presented in a bottom-sheet or modal, while account
actions use a modal sign-in/sign-up interface.

The system architecture separates the browser application from an optional
offline Python/SQLite pipeline. The browser does not communicate with an
application backend.

### Development

The implementation is organized around `src/App.jsx`, which owns tab state,
search filters, account session state, favorites, language, and the selected
restaurant.

Key modules include:

- `src/services/restaurants.js` for 267 bundled restaurant records
- `src/utils/recommend.js` for normalization, filtering, scoring, and ranking
- `src/pages/` for primary screens
- `src/components/restaurants/` for card, list, and detail components
- `src/components/AuthModal/AuthModal.jsx` for prototype accounts
- `src/utils/i18n.js` for Thai/English text
- `src/utils/googleMaps.js` for Google Maps directions URLs

The data pipeline under `data_pipeline/` can collect, clean, merge, enrich,
and export restaurant data with SQLite. It is optional and is not invoked by
the frontend build or a runtime API.

### Testing

No automated JavaScript test framework existed initially. Vitest and Testing
Library were introduced as lightweight, separate test tooling for React and
Vite.

Automated tests cover:

- 267-record dataset size
- Empty and named searches
- Thai and English location and cuisine parsing
- Budget filtering
- Open-now limitation
- Prototype registration and login validation
- Language persistence
- Favorite persistence across app remount
- Search UI rendering
- Restaurant detail rendering
- Google Maps URL construction

A production build also completed successfully.

The repository contains additional usability evidence, including a
supplementary report of 12 SUS participants and timed sessions for two users.
However, some statements in that report describe GPS, live map pins, and live
nearby workflows that are not confirmed in the current source. Accordingly,
those statements should not be used as evidence of current GPS or map
functionality. The signed-off SUS and task-based data also need source-level
verification against an approved test evidence record before publication of
exact performance claims.

## 5. Solution

The implemented prototype helps users start discovery through area shortcuts
and text search. It provides:

- Area browsing for MFU, Chiang Rai city, Mae Sai, and other districts
- Search across restaurant name, location, cuisine, description, price text,
  Halal status, and menu names
- Ranked restaurant cards
- A restaurant detail modal showing available cuisine, price, area,
  description, opening hours, menu, and directions
- Local prototype favorites
- Thai and English interface switching
- Google Maps directions generated from coordinates or a text query

The “AI” recommendation interface is rule-based. It parses supported terms
from a prompt and applies local filters and a fallback chain. It does not call
an external LLM.

The following remain planned rather than implemented:

- Live GPS and distance calculation
- An interactive map
- Prayer facilities
- Certificate provenance
- Backend APIs
- PostgreSQL/PostGIS
- Google OAuth
- Server-side sessions
- Email delivery
- Reviews and owner/admin workflows

## 6. Outcome and Impact

The successfully developed outcome is a working browser-based discovery
prototype. It demonstrates the primary information flow from area or prompt
selection through filtering and detail viewing.

User research identified a clear need for centralized discovery and information
comparison. The implemented interface directly addresses portions of that need
by combining bundled restaurant records, search, area shortcuts, detail fields,
favorites, and navigation.

The initial implementation evidence includes:

- 267 bundled restaurant records
- A 267-record SQLite merged export
- 17 automated Vitest/Testing Library tests passing
- A successful Vite production build
- Thai/English UI, browser favorites, and local account behavior

These results verify the automated test scope rather than real-world adoption.
The 25-person questionnaire supports the original problem hypothesis but does
not establish production impact. No verified live deployment or user population
outcome is available.

Some usability evidence is documented for 12 SUS participants and for two
timed task participants. It includes a reported mean SUS score of 87.92 and
positive task findings. Before those figures are presented as final project
outcomes, the signed questionnaire and task records must be reconciled with the
approved testing evidence, and the test protocol must align with the features
that actually exist in the current build.

## 7. Technical Highlights

### Technology stack

- React and React DOM
- Vite
- JavaScript and JSX
- CSS
- lucide-react
- Browser `localStorage`
- Python, SQLite, Pandas, Geopy, and Requests for optional offline data work
- Vitest and Testing Library for automated tests

### Architecture

The runtime architecture is client-side. `src/App.jsx` coordinates state,
while page and restaurant components render the UI. Restaurant records are
bundled and imported directly from `src/services/restaurants.js`.
`src/utils/recommend.js` performs browser-side filtering and ranking.

Google Maps is opened through a URL helper rather than an embedded map SDK.
No backend or external account service participates in the current flow.

### Data storage

The frontend uses a JavaScript array at runtime and browser `localStorage` for
prototype identity, session, favorites, and language. The optional pipeline
uses SQLite to merge and export the data.

### Recommendation approach

The recommendation system normalizes text, expands Thai/English aliases,
derives zones, filters cuisine and budget, scores matching records, and sorts
by match score. Short prompts can match restaurant names directly. Longer
prompts are parsed by supported keywords and relaxed through a fallback chain.

This is deterministic rule-based logic, not machine-learning or LLM
recommendation.

## 8. Limitations and Future Improvements

### Current limitations

- Prototype passwords are plain text in browser storage.
- Accounts and favorites do not synchronize across devices or profiles.
- `openNow` is not a working live-hours filter.
- `halalOnly` and `requiredAmenities` are not complete recommender filters.
- Halal and verification data require source review and should not be treated
  as certification.
- Opening and menu fields are incomplete across some records.
- The dataset is bundled and can become stale.
- There is no live GPS or interactive map.
- There is no backend, authorization, consent storage, or audit logging.
- Automated browser end-to-end coverage is not yet configured.
- No production deployment URL is confirmed.

### Future improvements

The backlog identifies:

- Live map and nearby facility discovery
- Certificate and provenance workflows
- Community reviews
- Restaurant-owner management
- System-admin moderation
- Issue reporting
- Trip planning
- Backend APIs and PostgreSQL/PostGIS
- Production authentication and consent controls
- A stronger recommendation system if privacy, data, and model requirements are
  approved

## 9. Live Demo

** https://muslimproject-9bxqhzh5t-cherpeachyada.vercel.app?_vercel_share=y7Y2WNnOMWLmpFqSSC9JTCmbDg6mY1sJ **

No valid public deployment URL or hosting configuration was found in the
repository. The verified run method is local:

```bash
npm install
npm run dev
```

Vite normally prints `http://localhost:5173`, depending on port availability.
This is a local development URL, not a deployed application.

The prototype has no predefined test account. Developers can create a
browser-local account through the sign-up interface. Use only local test values
and do not enter sensitive passwords or personal data.

## 10. Conclusion

Halal Chiang Rai was created to address difficulties finding nearby Halal
restaurants and comparing incomplete information across separate platforms.
User research from 25 Chiang Rai-connected respondents supported that problem
and showed strong interest in centralized discovery, menus, prices, and Halal
information.

The project delivered a mobile-first browser prototype with area browsing,
search, ranked local results, restaurant details, favorites, bilingual support,
and rule-based recommendations. It also established an offline data pipeline
and a clear backlog for backend and verification capabilities.

Its verified technical outcome is an implemented frontend prototype, not a
production certification or restaurant-discovery service. Future development
should prioritize reliable live data, halal provenance, secure accounts,
production deployment, and evidence-based usability validation.
