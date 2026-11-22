# Test Results

## 1. Execution Metadata & Environment

* **Project:** Halal Restaurant & Facility Discovery Platform (Chiang Rai) — *Halal Nue Sud*
* **Build / Version:** Version 1.0 (Phase 1 Frontend Prototype, Vite build)
* **Execution Date:** 17 November 2026
* **Test Environment:** ASUS Laptop, Windows 11, Google Chrome (local browser storage), Wi-Fi

## 2. Execution Summary

| Test Suite | Identifiers | Total | Passed | Failed | Not Run | Not Testable | Outcome Summary |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| E2E Core Workflows | `TC-01`–`TC-05` | 5 | 5 | 0 | 0 | 0 | `100%` passed across area browse, search, details/Maps, favorites, and TH/EN switch |
| Functional Tests | `TC-01`–`TC-19` | 19 | 18 | 1 | 0 | 0 | `94.74%` passed; `TC-19` failed on unrecognized Home prompt |
| Negative & Boundary | `NT01`–`NT06` | 6 | 3 | 0 | 1 | 2 | `NT01`, `NT02`, `NT05` passed; `NT03` not run; `NT04`, `NT06` out of Phase 1 scope |
| Task-Based UAT | `UAT01`–`UAT03` (`U01`–`U02`) | 6 attempts | 6 | 0 | 10 rows (`U03`–`U12`) | 0 | `100%` success (`0` errors); mean task time reduced `93.03%` (`6.265` → `0.437` min) |
| Post-Test SUS Survey | `R01`–`R12` (10 items) | 12 | — | — | 0 | 0 | Mean SUS = **`87.92 / 100`** (`SD = 11.52`, `Median = 88.75`, benchmark `68.0`) |

## 3. Key Observed Outcomes & Exceptions

* **Passed Core Capabilities (`TC-01`–`TC-18`, `NT01`, `NT02`, `NT05`):** Area shortcuts, real-time Thai/English search, empty-state handling (`"No results found"`), search reset, detail sheet rendering (including absent menu fallback), local account favorite isolation, TH/EN browser persistence, and structured Home prompt parsing all operated as expected.
* **Functional Failure (`TC-19` — Low):** Submitting an unrecognized conversational phrase (`"The weather is nice today"`) on Home returned *"No recommendations from AI"* because no external AI service is connected in Phase 1.
* **Not Run & Out-of-Scope Checks (`NT03`, `NT04`, `NT06`):** `NT03` (empty area selection) was not executed in this run; `NT04` (deny location permission, `US08`) and `NT06` (halal certificate provenance, `US09`) are `Not Testable in Current Build` and are not inferred as passed.
* **User-Reported Issues (`ISS-01`–`ISS-03`):** Map pin offset for certain venues (`R01`), request for restaurant photos and minimum price labels (`R11`), and missing local vendor listing (`R11`).
* **AI SDLC Impact:** Test preparation time decreased by **`50.0%`** (`180` min manual estimate → `90` min AI-assisted including manual review).

## 4. Evidence Links

* **Full Test Cases & Plan:** [`test-plan.md`](./test-plan.md) (`TEST PLAN_2.docx`)
* **Before/After Task Timing:** [`before-after-results.md`](./before-after-results.md) (`Task based testing (1).xlsx`)
* **SUS Scoring Breakdown:** [https://docs.google.com/spreadsheets/d/1dHbi-yYPlCA5g3u0twV-alIowBsrFF9EnYURu1q4lO0/edit?usp=sharing](./sus-results.md) (`Halal Nue Sud  (1).xlsx`)
* **Defect & Usability Log:** [`issue-log.md`](./issue-log.md)
* **Sample Justification & Supplementary Checks:** [`no-real-user-test.md`](./no-real-user-test.md)
* **Session Logs & Privacy Controls:** [`session-logs.md`](./session-logs.md)
* **Step-by-Step Diagram & Consented Media:** [Miro Board](https://miro.com/app/board/uXjVEU850cY=/?share_link_id=625886115636) & restricted-access team Google Drive