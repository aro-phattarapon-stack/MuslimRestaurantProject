# Test Plan

**Project:** Halal Restaurant & Facility Discovery Platform (Chiang Rai)  
**Document:** Software Test Plan  
**Version:** 1.0  
**Prepared by:** Nisreen Dasaresamoh  
**Date:** 27/10/69 (27 October 2026)

---

## Status

* **Approval & Execution Status:** Approved (`v1.0`, 28 October 2026) and executed against Phase 1 frontend prototype (`Version 1.0`).
* **Test Owner:** Nisreen Dasaresamoh (Tester), supported by Rungtiwa Penpichai (Product Owner), Phattarapon Kakad (Tech Lead), Phichayathida Laeae (Designer), and Prakayrat Potaree (AI Lead).
* **Schedule:** Plan finalized `28 October 2026`; UAT & SUS executed `17 November 2026`; final presentation `18 November 2026`.
* **Environments:** ASUS Laptop, Windows 11, Google Chrome, Wi-Fi, local browser storage, and Google Drive for evidence storage (see **Section 2.6**).

## Current Test Infrastructure

* `package.json` currently defines Vite development, build, and preview scripts; no automated JavaScript test-runner script is configured.
* Testing is conducted through structured manual functional test cases (`TC-01`–`TC-19`), negative/boundary checks (`NT01`–`NT06`), moderated task-based UAT (`UAT01`–`UAT03`), and post-test SUS evaluation (see **Sections 2 & 4**).

## Planned Coverage

* **In-Scope & Out-of-Scope Backlog Coverage:** Prioritizes Phase 1 Must-Have stories (`US01`, `US02`, `US04`, `US06`) alongside implemented search/account/prompt behaviors (`US03`, `US05`, `US07`), while excluding unbuilt Phase 2 features (`US08`–`US13`) from Phase 1 acceptance (see **Sections 1.4–1.5**).
* **Test Levels, Browser & Entry/Exit Criteria:** Covers Conceptual Unit/Integration logic, E2E/Functional/Negative test cases (`TC-01`–`TC-19`, `NT01`–`NT06`), and UAT on Google Chrome (Windows 11) with explicit status rules (`Pass`, `Fail`, `Blocked`, `Not Run`, `Not Testable in Current Build`) and exit criteria (see **Sections 2, 3, 4 & 6.4**).
* **Privacy & Data Integrity Checks:** Requires informed consent prior to testing, separate consent for photos/videos, anonymized participant IDs (`U01`, `U02`, etc.), and honest reporting of incomplete sample sizes without fabricated data (see **Section 5.7**).

## Evidence and Reporting

* **Functional Test Results:** `18/19` functional test cases passed (`TC-01`–`TC-18`) and `1/19` failed (`TC-19`: unrecognized conversational prompt returned no AI recommendations due to no external AI integration in Phase 1); E2E summary table (`TC-01`–`TC-05`) in Section 2.3 reflects pre-execution status (`Not Run`), while executed results are recorded in **Section 4.1**.
* **UAT, Before/After & SUS Metrics:** Recorded in **Sections 5.4–5.5** and linked repository logs (`before-after-results.md`, `sus-results.md`, `issue-log.md`, `no-real-user-test.md`, `session-logs.md`), plus AI SDLC preparation metrics in **Section 5.6**.

---

## 1. Scope

### 1.1 Project Overview
The Halal Restaurant & Facility Discovery Platform is designed to help Muslim users discover halal restaurants and Muslim-friendly facilities in Chiang Rai. The platform aims to make it easier for users to search for restaurants, filter results by area and preferences, review halal status, and access useful restaurant information.

This Test Plan defines the testing scope, test levels, test cases, user acceptance testing (UAT), measurement methods, schedule, team responsibilities, and risks.

### 1.2 Testing Objectives
The objectives of testing are to:
* Verify that the platform's core search and discovery workflow behaves according to the Product Backlog.
* Verify that users can find relevant restaurants using supported search and area-filtering functions.
* Check whether halal status and venue information are presented clearly and consistently.
* Identify functional defects, usability problems, and gaps between the specified requirements and the current implementation.
* Evaluate task completion, task completion time, and user errors during real-user testing.
* Collect evidence to evaluate the platform's usability and the impact of AI-assisted work on the team's software development life cycle (SDLC).

### 1.3 Core Workflow
The main workflow is intended to allow a user to:
1. Open the platform.
2. Search for a restaurant or use an available area filter.
3. Review the returned results.
4. Select a restaurant.
5. View its details, including halal status and relevant restaurant information.

Testing will prioritize this workflow because it represents the main user journey for discovering halal restaurants.

### 1.4 In-Scope Requirements
Testing scope is based on the supplied Product Backlog and its MoSCoW prioritization.

**Must Have**

| User Story | Requirement | Main testing focus |
| :--- | :--- | :--- |
| US01 | Browse by area | Verify that the homepage displays area shortcuts and selecting an area opens Search with the selected area applied to matching logic. |
| US02 | Search restaurants | Verify that users can search by restaurant name, dishes, and areas, including supported Thai and English keywords. |
| US04 | View restaurant details | Verify that selecting a restaurant opens its detail sheet and displays available information such as cuisine, price, description, area, opening hours, menu, and Google Maps directions. |
| US06 | Use the app in two languages | Verify that the language control switches correctly between Thai and English and that the selected language is persisted in the browser. |

These user stories form the primary Phase 1 functional scope. However, their inclusion in the Product Backlog does not confirm that every feature is implemented in the current application.

**Should Have**

| User Story | Requirement | Main testing focus |
| :--- | :--- | :--- |
| US08 | Live map | Verify GPS location, map display, distance calculation. |
| US09 | Halal verification provenance | Verify certificate evidence, issuing authority, expiry dates, and verified/unverified status. |
| US10 | Community reviews | User ratings, text reviews, photo uploads, and review management. |
| US11 | Restaurant-owner portal | Restaurant owner registration, listing management, profile editing, and certificate submission. |
| US12 | Issue reporting | Issue submission, report tracking, and administrator moderation. |

These requirements are included in the broader backlog but are lower priority than the Must Have workflow.

**Could Have**

| User Story | Requirement | Main testing focus |
| :--- | :--- | :--- |
| U07 | Improved recommendation logic | Support additional search phrases, improve preference interpretation, and provide more relevant restaurant recommendations. |

These improvements may be considered for future versions to enhance the recommendation experience.

**Won't Have**

| User Story | Requirement | Scope decision |
| :--- | :--- | :--- |
| US13 | Trip planner | Multi-stop route planning and total distance calculation are excluded from the current prototype and deferred to a future development phase. |

This feature is not included in the current prototype scope but may be considered for future development.

### 1.5 Out of Scope
The following are outside the Phase 1 acceptance scope:
* US08–US13 future features, including live maps and nearby facilities, halal verification provenance, community reviews, restaurant-owner portal, issue reporting, and multi-stop trip planning.
* Full acceptance testing of features that are not implemented or cannot be accessed in the current build.
* Claims that a halal certificate is officially valid without checking the underlying evidence and issuing source.
* Backend-based authentication, server-side data storage, and compliance management, as the current prototype stores account, session, language, and favorite data locally in the browser.
* Security certification or penetration testing unless separately planned.
* Production-scale performance testing unless suitable requirements and an environment are provided.

Features outside the acceptance scope may still be recorded as implementation gaps or future work.

---

## 2. Test Levels and Test Environment

### 2.1 Unit Testing
* **Purpose:** Verify individual functions or components independently.
* **Examples include:**
  * Checking the logic that filters restaurants by district.
  * Checking keyword-matching logic.
  * Checking distance calculations.
  * Checking the logic that distinguishes halal certification from Muslim-friendly status.
* **Expected evidence:** Unit-test results, assertions, and recorded evidence.

### 2.2 Integration Testing
* **Purpose:** Verify that connected components exchange and process data correctly.
* **Examples include:**
  * Search input and the results list.
  * Area-filter selection and displayed results.
  * A selected restaurant and its detailed view.
  * Location permission.
  * Authentication and favorites.
  * Merchant submissions and administrator records.
* **Expected evidence:** Integration-test results, relevant logs, and defect records.

### 2.3 End-to-End (E2E) Testing
**End-to-End (E2E) Functional Test Cases:** The team designed E2E test cases to evaluate the main restaurant discovery workflows in the current frontend prototype.

| Test Case ID | Level | Scenario / Feature | Steps | Test Data | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-01 | E2E | Browse Restaurants by Area | 1. Open the homepage. 2. Select an available area shortcut. 3. Inspect the search results. | Available area (e.g., MFU / Chiang Rai City / Mae Sai) | Search opens with the selected area applied to the matching logic and displays relevant restaurant results. | Not Run |
| TC-02 | E2E | Search Restaurants by Keyword | 1. Open the Search page. 2. Enter a restaurant name or dish keyword. 3. Inspect the returned results. | Existing restaurant name or menu keyword | The system displays restaurants matching the entered search query according to the implemented search logic. | Not Run |
| TC-03 | E2E | Restaurant Details & Google Maps Navigation | 1. Select a restaurant card. 2. Review restaurant details, including available menu, prices, and opening hours. 3. Select Google Maps directions. | Existing restaurant record with location information | The restaurant detail sheet displays available information correctly, and Google Maps opens with the restaurant destination. | Not Run |
| TC-04 | E2E | Save and Retrieve Favorite Restaurants | 1. Create or access a local prototype account. 2. Open a restaurant detail sheet. 3. Save the restaurant as a favorite. 4. Open the Favorites tab. | Local prototype account and an existing restaurant record | The selected restaurant is saved and displayed in the Favorites tab for the corresponding browser account. | Not Run |
| TC-05 | E2E | Switch Application Language | 1. Open the application. 2. Select the language control. 3. Switch between Thai and English. 4. Refresh the browser. | Thai and English language settings | The interface switches to the selected language, and the selected language remains saved after refreshing the browser. | Not Run |

> **Note:** Test execution status must reflect actual testing results. Features that are unavailable in the current build must not be reported as passed. GPS nearby search, interactive map display, and live location-based discovery are excluded from the current E2E testing scope.

### 2.4 User Acceptance Testing (UAT)
* **Purpose:** Evaluate whether representative users can complete realistic tasks and understand the information the platform provides.
* UAT will be conducted with real users on **17 November 2026**.
* The team will aim for at least 10 real-user testing sessions, preferably with people who represent the intended users of the platform. Participants should not be given the answer or exact navigation path in advance.

### 2.5 Testing Pyramid
The testing approach follows three technical test levels, supplemented by UAT:
* **Unit testing:** Individual logic and components.
* **Integration testing:** Interactions between components.
* **E2E testing:** The complete core user journey.
* **UAT:** Real users completing representative tasks.

Unit and integration tests help detect problems early, while E2E and UAT evaluate whether the complete experience works as expected.

### 2.6 Test Environment

| Item | Environment / Details |
| :--- | :--- |
| Application | Halal Restaurant & Facility Discovery Platform (Chiang Rai) |
| Application version | Version 1.0 |
| Device | ASUS Laptop |
| Operating system | Windows 11 |
| Browser or runtime | Google Chrome |
| Network | Wi-Fi |
| Test data | Existing restaurant records and controlled test inputs |
| Evidence storage | Google Drive |

Only environments that are actually used should be recorded. The team must not claim to have tested on devices, browsers, or operating systems that were not used.

---

## 3. Test Data and Test Execution Rules

### 3.1 Test Data
Prepare test data that allows the team to check both valid and invalid scenarios. Examples include:
* A restaurant whose name is known to the tester.
* A restaurant associated with a known district.
* A keyword that should match an existing restaurant.
* A keyword that should return no matching results.
* A restaurant with known halal-status information.
* A restaurant with known detailed information, such as price or opening hours.

### 3.2 Test Execution Status
Each test case must receive one of the following statuses:

| Status | Meaning |
| :--- | :--- |
| Pass | The observed result meets the expected result. |
| Fail | The observed result does not meet the expected result. |
| Blocked | Testing cannot proceed because of a dependency or environmental problem. |
| Not Run | The test has not been executed. |
| Not Testable in Current Build | The required feature is missing or inaccessible in the tested build. |

---

## 4. Test Cases and UAT Scenarios

### 4.1 Functional Test Cases
The following test cases are proposed from the Product Backlog. The test executor must confirm that each feature is accessible before execution.

| Test Case ID | Story Ref. | Test Scenario | Pre-conditions | Test Steps | Expected Result | Priority | Status (Pass/Fail) | Actual Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-01 | US01 | Verify area shortcuts display on Home page | User is on the Home page | 1. Open the application's Home page. 2. Observe the area shortcuts section. | Area shortcuts for Chiang Rai are displayed clearly (e.g., MFU, Chiang Rai city, Mae Sai, and other Chiang Rai areas). | High | Pass | — |
| TC-02 | US01 | Select an area shortcut to filter restaurants | User is on the Home page | 1. Click on an area shortcut button (e.g., "MFU"). | The app navigates to the Search page with the selected area ("MFU") automatically applied to the matching logic. | High | Pass | — |
| TC-03 | US02 | Real-time search query updates | User is on the Search page | 1. Type a search query character by character into the search bar (e.g., "Khao Soi"). | Search results update dynamically in real-time as the query changes without requiring the user to press Enter. | High | Pass | — |
| TC-04 | US02 | Search matching across all supported data fields | User is on the Search page | 1. Search using terms matching Restaurant name, Location/area, Cuisine, Description, Price text, Halal status, Menu item names. | The system accurately returns restaurants matching the search terms across each respective field. | High | Pass | — |
| TC-05 | US02 | Bilingual alias support (Thai/English) in search | User is on the Search page | 1. Search using English terms: "noodles", "coffee", "desserts", "MFU", "Mae Sai". 2. Search using equivalent Thai terms: "ก๋วยเตี๋ยว", "กาแฟ", "ของหวาน", "แม่ฟ้าหลวง", "แม่สาย". | The system recognizes both Thai and English aliases and returns matching restaurants consistently for both languages. | High | Pass | — |
| TC-06 | US02 | Search with non-matching keywords (No Results) | User is on the Search page | 1. Enter a query that does not exist in the database (e.g., "xyz12345"). | The system displays an appropriate empty state ("No results found") without crashing or throwing UI errors. | Medium | Pass | — |
| TC-07 | US03 | Verify removal of manual cuisine and budget filters | User is on the Search page | 1. Inspect the UI controls on the Search page. | Separate manual filter controls for cuisine and budget are no longer exposed; users search solely via text input. | Medium | Pass | — |
| TC-08 | US04 | Open restaurant detail sheet | Restaurant cards are displayed on screen | 1. Click on a restaurant card. | A detail sheet opens displaying information for the selected restaurant. | High | Pass | — |
| TC-09 | US04 | Verify completeness of information in detail sheet | Detail sheet is open for a restaurant with full data | 1. Inspect all fields displayed within the detail sheet. | Displays cuisine, price, description, area, opening hours, menu with prices (when present), favorite button, and Google Maps directions action. | High | Pass | — |
| TC-10 | US04 | Google Maps directions functionality | Detail sheet is open for a restaurant | 1. Click on the Google Maps directions button/link. | Opens Google Maps (app or web) directed to the accurate location/coordinates of the restaurant. | High | Pass | — |
| TC-11 | US04 | Detail sheet display when menu data is absent | Detail sheet is open for a restaurant without menu data | 1. Inspect the menu section in the detail sheet. | The menu section is gracefully hidden or handled without breaking the layout. | Low | Pass | — |
| TC-12 | US05 | Attempt to save a favorite without a prototype account | User is not logged into a local prototype account | 1. Click the Favorite icon/button on a restaurant card or detail sheet. | System prompts the user to create or select a local prototype account before allowing the restaurant to be saved. | High | Pass | — |
| TC-13 | US05 | Save and view favorites with an active account | User is logged into Local Prototype Account A | 1. Click Favorite on Restaurant X. 2. Navigate to the "Favorites" tab. | Restaurant X is saved and displayed under the Favorites tab. | High | Pass | — |
| TC-14 | US05 | Account isolation for saved favorites in browser | Account A has Restaurant X saved | 1. Switch to Local Prototype Account B in the same browser. 2. Check the "Favorites" tab. 3. Switch back to Account A. | Account B's Favorites tab does not show Restaurant X; switching back to Account A confirms Restaurant X is still saved there. | Medium | Pass | — |
| TC-15 | US06 | Switch application language between Thai and English | User is on any page of the application | 1. Click the header language control to switch from TH to EN, then switch back to TH. | All UI labels and supported content switch immediately to the selected language. | High | Pass | — |
| TC-16 | US06 | Browser persistence of selected language | User has switched the language to English (EN) | 1. Refresh the browser page or close and reopen the tab. | The application retains English (EN) as the active language. | Medium | Pass | — |
| TC-17 | US07 | Parse area, cuisine, and budget in Home prompt | User is on the Home page | 1. Enter a descriptive phrase into the Home prompt (e.g., "Northern food near MFU under 100 baht"). 2. Submit the prompt. | The local parser extracts area (MFU), cuisine (Northern food), and budget (<= 100) preferences and displays ranked restaurant recommendations. | Medium | Pass | — |
| TC-18 | US07 | Short prompt matching a restaurant name on Home | User is on the Home page | 1. Enter a short prompt matching an existing restaurant name. 2. Submit the prompt. | The app opens the Search page pre-populated with that restaurant name query and displays matching results. | Medium | Pass | — |
| TC-19 | US07 | Handle unrecognized or unsupported phrases in Home prompt | User is on the Home page | 1. Enter an unsupported sentence with no recognizable area, cuisine, budget, or restaurant keywords (e.g., "The weather is nice today"). 2. Submit the prompt. | The local parser handles the input gracefully (e.g., fallback message or general recommendations) without throwing errors, despite having no external AI connected. | Low | Fail | No recommendations from AI |

### 4.2 Negative and Boundary Tests
The team should also consider the following checks when the relevant functions are available:

| Test ID | Scenario | Expected Result |
| :--- | :--- | :--- |
| NT01 | Search using a keyword that does not match any restaurant | A clear empty-result state is displayed; unrelated restaurants are not presented as matches. |
| NT02 | Clear the search field | The search interface returns to the appropriate default state. |
| NT03 | Select an area that has no matching restaurant | The result state correctly communicates that no matching restaurants are available. |
| NT04 | Deny location permission | The app handles the denial without falsely claiming to know the user's current location. |
| NT05 | Open a restaurant with incomplete detail information | Missing fields are handled clearly and are not replaced with fabricated information. |
| NT06 | Review a restaurant whose certificate evidence is unavailable | The interface does not misrepresent the restaurant as having verified, current certificate evidence. |

These tests should be adapted to the actual acceptance criteria and behavior of the current build.

### 4.3 UAT Task Scenarios
The UAT moderator should present tasks in neutral language. Participants should not be told the exact answer or the specific buttons to press. To keep the session manageable and aligned with the core MUST workflows, 3 primary UAT tasks (`UAT01` to `UAT03`) are prioritized for real-user testing:

| UAT ID | Participant Task | What to Observe | Success Criteria |
| :--- | :--- | :--- | :--- |
| UAT01 | **Find Nearby Restaurants & Map:** Locate the closest Halal restaurant to your current location using the map/nearby feature. | Whether the participant grants location access, locates nearby restaurants on the map, time taken, errors, and requests for help. | The participant displays nearby Halal restaurants on the map. |
| UAT02 | **Search by Area Zone:** Browse and find Halal restaurants in a specified area or zone of Chiang Rai without typing a restaurant name. | Whether the participant locates the zone filter, selects the correct area, and understands the filtered results. | The participant selects the required zone filter and displays matching area. |
| UAT03 | **View Details & Navigate via Google Maps:** Open a selected restaurant's details (such as opening hours, price range, and halal status) and launch navigation to get there. | Whether the participant finds key venue information accurately and initiates Google Maps directions without confusion. | The participant reviews restaurant details and launches Google Maps navigation. |

### 4.4 Test Case Review and AI Disclosure
AI may be used to help draft test cases, organize requirements, or prepare documentation. However:
* The team must review every AI-generated test case.
* Expected results must be checked against the Product Backlog and acceptance criteria.
* Test cases must be adapted to the actual application.
* The team must disclose AI usage in accordance with the course requirements.
* AI-generated content must not be treated as evidence that testing has occurred.

---

## 5. Metrics and Evaluation

### 5.1 Task Success Rate
* **Purpose:** Measure how many participants successfully complete a task.
* **Formula:** `Task Success Rate (%) = (Number of successful task attempts ÷ Total valid task attempts) × 100`
* A successful attempt must meet the task's predefined success criteria. The team should define these criteria before testing and apply them consistently.

### 5.2 Time on Task
* **Purpose:** Measure how long participants take to complete each task.
* **Method:** Record timing in seconds from task start to completion (or stop). Record unsuccessful attempts separately, and use consistent timing rules for both baseline and platform conditions.
* **Formula:** `Mean Time on Task = Total time for completed attempts ÷ Number of completed attempts`

### 5.3 User Errors
* **Purpose:** Identify difficulties that prevent or delay task completion.
* Record errors such as:
  * Selecting the wrong area.
  * Entering a keyword that does not match the task requirements.
  * Misinterpreting the halal-status label.
  * Failing to find required venue information.
  * Requiring moderator assistance.
  * Attempting to use a feature that is unavailable.

### 5.4 Before-and-After Comparison
The course requires before-and-after measurements for the core workflow. The baseline should represent how participants perform the relevant task using the existing or previous method before using the platform.

For example, participants may first locate a venue using their normal method and then perform a comparable task using the platform. The baseline method must be recorded accurately; do not claim that all participants used a particular method unless that is what happened.

| Measurement | Before using the platform | Using the platform |
| :--- | :--- | :--- |
| Task success rate | 100% (Completed with extended exploration) | 100% (2/2 passed all 3 MUST tasks) |
| Time on task | 6.27 min | T1: 0.68 min (40.8 sec)<br>T2: 0.31 min (18.6 sec)<br>T3: 0.33 min (19.8 sec) |
| User errors | 0.0 error/user | 0.0 errors/user |
| Assistance required | Minimal | None |

* **Percentage time reduction formula:** `Time Reduction (%) = ((Baseline Mean Time - Platform Mean Time) ÷ Baseline Mean Time) × 100`
* A positive value indicates that the platform condition took less time; a negative value indicates that it took more time.

### 5.5 System Usability Scale (SUS)
The System Usability Scale (SUS) will be used as an optional standardized questionnaire to evaluate users' perceived usability of the Halal Restaurant & Facility Discovery Platform.

Participants complete the questionnaire after performing the assigned usability testing tasks. Each statement is rated on a 5-point Likert scale (`1 — Strongly Disagree`, `2 — Disagree`, `3 — Neither Agree nor Disagree`, `4 — Agree`, `5 — Strongly Agree`):

| No | SUS Statement | Response |
| :--- | :--- | :--- |
| 1 | I think that I would like to use this system frequently. | 1 / 2 / 3 / 4 / 5 |
| 2 | I found the system unnecessarily complex. | 1 / 2 / 3 / 4 / 5 |
| 3 | I thought the system was easy to use. | 1 / 2 / 3 / 4 / 5 |
| 4 | I think that I would need the support of a technical person to be able to use this system. | 1 / 2 / 3 / 4 / 5 |
| 5 | I found the various functions in this system were well integrated. | 1 / 2 / 3 / 4 / 5 |
| 6 | I thought there was too much inconsistency in this system. | 1 / 2 / 3 / 4 / 5 |
| 7 | I would imagine that most people would learn to use this system very quickly. | 1 / 2 / 3 / 4 / 5 |
| 8 | I found the system very cumbersome to use. | 1 / 2 / 3 / 4 / 5 |
| 9 | I felt very confident using the system. | 1 / 2 / 3 / 4 / 5 |
| 10 | I needed to learn a lot of things before I could get going with this system. | 1 / 2 / 3 / 4 / 5 |

* **SUS Scoring:**
  * Odd-numbered items (1, 3, 5, 7, 9): `contribution = response − 1`.
  * Even-numbered items (2, 4, 6, 8, 10): `contribution = 5 − response`.
  * Add all 10 contributions and multiply the total by `2.5` (result from `0` to `100`; benchmark of `68` is used as a reference point rather than a pass/fail rule).

### 5.6 AI Impact on the Team's SDLC
* **Objective:** Measure whether AI assistance reduces test case preparation time without compromising quality.
* **Metric:** Test Case Preparation Time
* **Formula:** `Time Saved (%) = ((Manual Preparation Time - AI-Assisted Total Time) ÷ Manual Preparation Time) × 100`

| Measurement | Actual Result |
| :--- | :--- |
| Manual preparation time | 180 minutes |
| AI-assisted preparation time, including review | 90 minutes |
| Time saved (%) | 50.0% |
| Quality or correctness issues found | AI-generated test cases for features that are not yet built in Phase 1 (such as user login, favorites, and review) and used generic examples that did not fit our app. |
| Corrective actions taken | Reviewed all test cases manually, removed/marked unbuilt features as Not Testable, and edited the steps to match our live website. |

* **AI Usage Disclosure:** AI (ChatGPT / Gemini) was used to assist with drafting initial test cases, structuring documentation (`test/no-real-user-test.md` and `TEST PLAN.docx`), and organizing evaluation tables. The team manually reviewed, filtered, and verified all AI-generated content against the Product Backlog and actual application behavior before execution.

### 5.7 Data Integrity and Participant Privacy
* Record actual observations and results only.
* Do not fabricate task success rates, timing results, SUS scores, participant comments, or AI time savings.
* Use anonymized participant IDs such as `U01`, `U02`, and `U03`.
* Obtain participant consent before collecting evidence.
* Obtain separate consent before taking identifiable photographs or videos.
* Avoid recording unnecessary personal information.
* Store evidence in the team's approved location and restrict access as appropriate.
* Record missing or incomplete data honestly.
* Clearly identify any limitation that may affect the interpretation of results.

---

## 6. Participants, Schedule, Roles, and Exit Criteria

### 6.1 Participants
The team will aim to conduct at least 10 real-user testing sessions on **17 November 2026**.

| Item | Plan |
| :--- | :--- |
| Target | At least 10 real-user sessions |
| Target date | 17 November 2026 |
| Participant type | People representative of the intended users |
| Session format | Moderated task-based UAT |
| Tasks per session | 3 |
| Data collected | Task outcome, 1st test and 2nd test, Success, Error, and Notes |
| Evidence | User Evidence Log (P3), Impact Metrics (P4), and consented supporting evidence |

### 6.2 Schedule

| Date | Activity | Expected Output |
| :--- | :--- | :--- |
| 27 October 2026 | Review requirements, scope, backlog priorities, and proposed test cases | Reviewed scope and test cases |
| 28 October 2026 | Finalize and submit the Test Plan | Test Plan document |
| 29 October – 3 November 2026 | Prepare test data, devices, consent process, participant recruitment, and UAT materials | Ready-to-use test materials |
| 17 November 2026 | Conduct real-user testing; collect task metrics and user evidence | UAT results, User Evidence Log (P3), and Impact Metrics (P4) |
| 18 November 2026 | Presentation | 10-minute team presentation |

### 6.3 Team Roles and Responsibilities

| Role | Responsibilities | Assigned Member |
| :--- | :--- | :--- |
| Product owner | Manage project goals and requirements. | Rungtiwa Penpichai |
| Tech Lead | Lead technical development. | Phattarapon Kakad |
| Designer | Design the UI/UX. | Phichayathida Laeae |
| AI lead | Manage AI-related features. | Prakayrat Potaree |
| Tester | Test the system and report bugs. | Nisreen Dahsaresamoh |

### 6.4 Exit Criteria
Testing may be considered complete for reporting purposes when:
* The planned in-scope test cases have been executed where the current build permits.
* Every test case has a recorded status.
* Missing or inaccessible features are documented rather than marked as passed.
* The Golden Thread has been evaluated against the available implementation.
* UAT outcomes and the actual number of completed sessions are recorded.
* Required task metrics are reported using actual measurements.
* Before-and-after comparisons are documented, including the baseline method.
* The team has recorded usability problems, functional defects, and limitations.
* AI impact measurements and disclosures are completed if AI was used for the evaluated SDLC activity.
* Supporting evidence has been stored appropriately, with participant consent where required.
* If a target cannot be met, the team should document the reason and its impact rather than changing the result to imply success.

---

## 7. Step-by-Step Diagram

* **Miro Board:** [View Step-by-Step Diagram](https://miro.com/app/board/uXjVEU850cY=/?share_link_id=625886115636)

---

## 8. Risks and Limitations

### 8.1 Risks

| Risk | Potential Impact | Mitigation |
| :--- | :--- | :--- |
| Some backlog features may not be implemented in the current build | Planned tests cannot be executed | Check feature availability before testing; use `Not Testable in Current Build` where appropriate |
| Test data is incomplete or inaccurate | Search and verification results may be difficult to evaluate | Confirm test data before execution and document missing data |
| Fewer than 10 real-user sessions are completed | UAT evidence may be limited | Recruit participants early and report the actual sample size |
| Participants receive too much guidance | Task-success measurements may be biased | Use neutral task wording and record assistance |
| Before-and-after tasks are not comparable | Time and success comparisons may be misleading | Use comparable tasks and document differences in conditions |
| AI-generated test cases contain incorrect assumptions | Test results may not reflect the requirements | Review every test case against the backlog and actual application |
| Personal information is collected unnecessarily | Privacy risk | Use anonymized participant IDs and collect only necessary data |
| Halal-status information is incomplete | Users may misunderstand the status or its evidence | Check available evidence and clearly report missing verification information |

### 8.2 Limitations
* The quality of the results depends on the current application build and the availability of reliable test data.
* Results from a small number of participants may not represent all potential users.
* User feedback reflects participants' experiences under the specific test conditions.
* A displayed halal-status badge does not by itself prove the legal or official validity of a certificate.
* A test plan describes intended testing; it does not prove that testing has been completed.
* Features deferred from Phase 1 should not be treated as failures of the Phase 1 acceptance scope unless the project requirements change.

### 8.3 Defect and Improvement Reporting
For each failure or significant usability issue, record:
* Defect or issue ID (`TC-19`, `ISS-01`–`ISS-03` in `issue-log.md`).
* Related User Story and Test ID.
* Steps to reproduce.
* Expected result.
* Actual result.
* Severity or impact.
* Supporting evidence.
* Proposed corrective action.
* Retest result, if retesting occurs.

---

## 9. Deliverables and Evidence Checklist

Before the final presentation, the team should check that it has prepared the following:
* [x] Final Test Plan (`test-plan.md` / `TEST PLAN.docx`).
* [x] Reviewed test cases with links to relevant User Stories (`TC-01`–`TC-19`).
* [x] Actual test execution results and statuses.
* [x] UAT task instructions and success criteria (`UAT01`–`UAT03`).
* [x] Participant records using anonymized IDs (`U01`–`U02`, `R01`–`R12`).
* [x] AI usage disclosure and measured AI SDLC impact (`50.0%` preparation time saved).
* [x] SUS questionnaire and scoring summary (`sus-results.md`, mean `87.92`).
* [x] Defect and usability issue records (`issue-log.md`).
* [x] Supporting evidence collected with appropriate consent (`session-logs.md`).
* [ ] Final presentation with accurate results and limitations (`18 November 2026`).