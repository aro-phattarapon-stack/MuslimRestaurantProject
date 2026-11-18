# Task-Based Testing Report & Supplementary Evidence (`test/no-real-user-test.md`)

**Project:** Halal Nue Sud (Halal Restaurant Discovery & Navigation System)  
**Repository:** `aro-phattarapon-stack/MuslimRestaurantProject`  
**Test Scope:** 3 Core MUST Tasks + System Usability Scale (SUS)

---

## 1. Why Not (Reasons for Incomplete Real-User Task-Based Sessions)
* Our team conducted usability evaluations with **12 real target users (`U01`–`U12`)**, consisting of 5 Muslim consumers and 7 general consumers.
* Among these participants, **2 real users (`U01` and `U02`)** completed full moderated, timed task-based testing sessions across all 3 core tasks (`1st test` and `2nd test`) in addition to the SUS questionnaire.
* For the remaining **10 real users (`U03`–`U12`)**, due to tight project timelines and scheduling constraints for in-person field sessions before the final deadline, participants evaluated the live system remotely and completed the 10-item SUS questionnaire and qualitative feedback without timed per-task tracking.
* In strict compliance with the course academic integrity policy (no fabricated data), we transparently report only verified data and supplement the remaining sessions with team-executed E2E test cases, heuristic evaluations, and secondary evidence below.

---

## 2. What We Tested Instead (Supplementary & Secondary Evidence)

### 2.1 Verified Real-User Data ($n = 2$ Task-Based + $n = 12$ SUS)
* **`U01` (Muslim Consumer):** Passed all 3 tasks (2nd test time: T1 = 1.00 min, T2 = 0.44 min, T3 = 0.32 min | SUS = 90.0).
* **`U02` (Muslim Consumer):** Passed all 3 tasks (2nd test time: T1 = 0.35 min, T2 = 0.17 min, T3 = 0.34 min | SUS = 100.0).
* **Real-User Task Summary ($n = 2$):**
  * **T1 (Find Nearby Restaurants & Map):** Success `2/2 (100%)` | Mean Time: `0.68 min` (41 sec) | Errors/User: `0.0`
  * **T2 (Search by Zone):** Success `2/2 (100%)` | Mean Time: `0.31 min` (18 sec) | Errors/User: `0.0`
  * **T3 (Navigate via Google Maps):** Success `2/2 (100%)` | Mean Time: `0.33 min` (20 sec) | Errors/User: `0.0`
* **`U01`–`U12` (SUS Results):** All 12 real users evaluated the system using the 10-item SUS scale, achieving a **Mean score of 87.92 (SD = 11.52, Grade A+)**, significantly above the 68.0 industry benchmark.

### 2.2 Team Test Cases & Heuristic Review
* **End-to-End (E2E) Functional Test Cases:** Our team executed structured E2E test cases covering all 3 MUST workflows (GPS nearby search, zone filtering, and Google Maps deep-link redirection) across mobile and desktop browsers with a 100% pass rate.

| Test Case ID | Level | Scenario / Feature | Steps | Test Data | Expected Result | Status |
| :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | `E2E` | Find Nearby Restaurants & Map | 1. Open homepage<br>2. Allow GPS location permission<br>3. Tap "Nearby Restaurants" button | Current GPS coordinates (Mae Fah Luang area) | Nearby Halal restaurant pins and list are accurately displayed on the map | **Pass** |
| **TC-02** | `E2E` | Search Restaurants by Zone | 1. Open "Search by Zone" menu<br>2. Select a target area zone<br>3. Inspect filtered restaurant cards | Selected zone (e.g., Front MFU / City Center) | System filters and displays only Halal restaurants located in the selected zone | **Pass** |
| **TC-03** | `E2E` | Restaurant Details & Google Maps Navigation | 1. Tap a restaurant card to view details<br>2. Verify price range & opening hours<br>3. Tap "Navigate" (Google Maps) button | Any Halal restaurant record in the system | Restaurant details load properly and Google Maps launches with the exact destination pin | **Pass** |
| **TC-04** | `E2E` | Mobile Responsiveness & UI Consistency | 1. Open web app on mobile viewport (iOS/Android)<br>2. Navigate across all tabs and filters | Mobile browser screen (375x812 px) | All buttons, zone filters, and pricing/opening hour labels render cleanly without overflow | **Pass** |

* **Heuristic Evaluation (Nielsen's 10 Usability Heuristics):** Conducted a systematic UI/UX walkthrough focusing on *Consistency and Standards* and *Help and Documentation* to resolve minor usability friction identified in user `U05`'s SUS feedback (score: 60.0).

### 2.3 Secondary Evidence Links
- **Raw Task-Based Testing Log (`U01`–`U02`):** [Google Sheets - Task based testing](https://docs.google.com/spreadsheets/d/1rVo48FJn_3a-MTYpyrj4LzSSmVO-j7V8aEVBcYrpKh0/edit?usp=sharing)

- **SUS Calculation Dataset (`U01`–`U12`, Mean = 87.92, SD = 11.52):** [Google Sheets - SUS Score](https://docs.google.com/spreadsheets/d/1dHbi-yYPlCA5g3u0twV-alIowBsrFF9EnYURu1q4lO0/edit?usp=sharing)

- **Raw Survey Responses (`U01`–`U12`):** [Google Sheets - Google Form Responses](https://docs.google.com/spreadsheets/d/1O4x35_5OmM77yEP3OUuHh3ToDBOa5-YnfQ1vgLwYrlk/edit?usp=sharing)
---

## 3. Before / After Measured by Real Users & Team
Comparison between **Before (Baseline / 1st Test: locating Halal restaurants manually via traditional search or unguided exploration)** and **After (2nd Test: completing the task independently on Halal Nue Sud)**:

| Task | Task Description | Before (Baseline Mean) | After (Halal Nue Sud Mean) | Time Reduction (%) |
| :--- | :--- | :---: | :---: | :---: |
| **T1** | Find nearby Halal restaurants & view on map | `6.27 min` | `0.68 min` | `-89.2%` |
| **T2** | Filter and search restaurants by area zone | `6.27 min` | `0.31 min` | `-95.1%` |
| **T3** | View restaurant details & navigate via Google Maps | `6.27 min` | `0.33 min` | `-94.7%` |

*(Note: Baseline values represent the mean of initial guided exploration `1st test` times [3.24 min and 9.29 min = 6.27 min], and After values represent the mean of independent `2nd test` times across `U01`–`U02`.)*

---

## 4. Issue Log & Fixes

| ID | Issue Description | Source | Severity (0–4) | Action Taken | Fix Commit | Retest |
| :---: | :--- | :--- | :---: | :--- | :---: | :---: |
| **ISS-01** | Restaurant details, pricing, and opening hours needed clearer formatting and accuracy on mobile screens | Team Heuristic Review & User Feedback | `2` (Minor) | Updated restaurant pricing and opening hours display for clarity (`ปรับราคาและเวลาเปิดปิด`) | [`a2dec49`](https://github.com/aro-phattarapon-stack/MuslimRestaurantProject/commit/a2dec49) | Passed (Verified on mobile) |
| **ISS-02** | Minor UI inconsistency and extended initial exploration time (9.29 min) to locate zone controls | `U02` (1st test) & `U05` (SUS Q4, Q6) | `2` (Minor) | Standardized zone-filter button placement and added clearer labels across navigation menus | [`a2dec49`](https://github.com/aro-phattarapon-stack/MuslimRestaurantProject/commit/a2dec49) | Passed (0.17–0.44 min, 0 errors) |

---

## 5. Ready-to-Run Plan for Real Users
To expand task-based testing to the remaining **10 real users (`U03`–`U12`)**, our team has prepared the following ready-to-run protocol:

* **Target Participants:** 5 Muslim consumers and 5 general consumers/tourists (aged 18–45) in the Mae Fah Luang / Chiang Rai area.
* **Format & Duration:** 1-on-1 moderated usability sessions (15–20 minutes per participant) with PDPA informed consent.
* **Team Roles:**
  * **Moderator:** Explains session rules ("testing the system, not the user"), reads task scenarios one at a time without hints, and conducts post-test interviews.
  * **Note-taker:** Records task completion times, logs errors, and captures user quotes.
* **Task Scenarios & Success Criteria:**
  1. **T1 (Nearby Restaurants):** *"Imagine you are hungry right now and want to find the closest Halal restaurant to your current location. How would you do that?"* — **Criterion:** Displays nearby Halal restaurants on the map within 60 seconds with 0 critical errors.
  2. **T2 (Search by Zone):** *"If you want to browse Halal restaurants in a specific area or zone without typing a restaurant name, where would you tap?"* — **Criterion:** Selects zone filter and displays area results within 45 seconds.
  3. **T3 (Google Maps Navigation):** *"Once you have a restaurant in mind and want directions to get there, what would you do next?"* — **Criterion:** Opens restaurant details and launches Google Maps navigation within 30 seconds.
* **Post-Task Measurement:** Administer the 10-item SUS questionnaire immediately after tasks, followed by a 3-question wrap-up interview.