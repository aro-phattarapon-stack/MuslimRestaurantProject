# Before/After Results

## 1. Source & Sample

* **Source File:** [(https://docs.google.com/spreadsheets/d/1rVo48FJn_3a-MTYpyrj4LzSSmVO-j7V8aEVBcYrpKh0/edit?usp=sharing)]
 (4 worksheets: `ค้นหาร้านใกล้ตัว&แผนที่` [Nearby Search & Map], `ค้นหาตามโซน` [Search by Zone], `นำทางไปGoogleMaps` [Navigate to Google Maps], and `Result`)
* **Recorded Sample ($n = 2$):**
  * `U01` (`User_Group`: `Muslim`)
  * `U02` (`User_Group`: `Muslim`)
* **Unrecorded Rows in Template:** `U03`–`U12` (10 empty rows per task worksheet; `User_Group`: General users [`คนทั่วไป`] = $0$ records)

## 2. Test Definitions & Task Criteria

* **Baseline (`1st test`):** Guided first attempt — the facilitator explains and demonstrates how to use the system, then lets the user try while coaching them.
* **Follow-up (`2nd test`):** Unassisted task test — the facilitator presents a task scenario question to test whether the user can complete it independently.
* **Success:** Passed using the system (no reason required when passed).
* **Error / Reason:** Failed using the system / reason for failure.
* **Target User Groups:** General users (`คนทั่วไป`) / Muslim (`มุสลิม`)
* **Measurement Unit:** Task completion time in minutes (`เวลาที่ใช้ทำ task (นาที)`)

### Task Prompts & Success Criteria

1. **T1 Nearby Search & Map** (`ค้นหาร้านใกล้ตัว&แผนที่`)
   * **Prompt:** *"Think of a restaurant near you right now — what do you need to do?"* (asked after the guided first trial)
   * **Success Criterion:** Finds a restaurant (`หาร้านอาหารเจอ`)
2. **T2 Search by Zone** (`ค้นหาตามโซน`)
   * **Prompt:** *"If we want to find restaurants by area without typing a search query, where do we tap?"*
   * **Success Criterion:** Displays surrounding restaurant areas (`แสดงพื้นที่ร้านอาหารรอบๆ`)
3. **T3 Navigate to Google Maps** (`นำทางไปGoogleMaps`)
   * **Prompt:** *"We already have a restaurant in mind and want to go there — where do we tap?"*
   * **Success Criterion:** Displays restaurant details (`ต้องขึ้นเป็นข้อมูลร้านต่างๆ`)

## 3. Individual Participant Records ($n = 2$)

| Task (Worksheet) | User_ID | User_Group | 1st test (min) | 2nd test (min) | Success | Error | Reason |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| Nearby Search & Map (`ค้นหาร้านใกล้ตัว&แผนที่`) | U01 | Muslim | 3.24 | 1.00 | pass | - | - |
| Nearby Search & Map (`ค้นหาร้านใกล้ตัว&แผนที่`) | U02 | Muslim | 9.29 | 0.35 | pass | - | - |
| Search by Zone (`ค้นหาตามโซน`) | U01 | Muslim | 3.24 | 0.44 | Pass | - | - |
| Search by Zone (`ค้นหาตามโซน`) | U02 | Muslim | 9.29 | 0.17 | Pass | - | - |
| Navigate to Google Maps (`นำทางไปGoogleMaps`) | U01 | Muslim | 3.24 | 0.32 | Pass | - | - |
| Navigate to Google Maps (`นำทางไปGoogleMaps`) | U02 | Muslim | 9.29 | 0.34 | Pass | - | *(blank)* |

## 4. Summary Comparison by Task ($n = 2$)

### Updated `Result` Summary Table (`Result` Worksheet)

| TASK | SUCCESS (%) | MEAN TIME (min) | BEFORE / OLD WAY (min) | ERRORS |
| :--- | :---: | :---: | :---: | :---: |
| T1 Nearby Search & Map (`ค้นหาร้านใกล้ตัว & แผนที่`) | 100 | 0.675 | 6.265 | 0 |
| T2 Search by Zone (`ค้นหาตามโซน`) | 100 | 0.305 | 6.265 | 0 |
| T3 Navigate to Google Maps (`นำทางไป Google Maps`) | 100 | 0.330 | 6.265 | 0 |
| **Overall Average (`เฉลี่ยรวม`)** | **100** | **0.437** (`0.436666667`) | **6.265** | **0** |

### Time Reduction Breakdown (From Task Worksheets, $n = 2$)

| Task | $n$ | 1st test Mean (min) | 2nd test Mean (min) | Mean Time Change (min) | % Time Reduction | Success Rate |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| T1 Nearby Search & Map (`ค้นหาร้านใกล้ตัว & แผนที่`) | 2 | 6.265 | 0.675 | -5.590 | 89.23% | 100% (2/2) |
| T2 Search by Zone (`ค้นหาตามโซน`) | 2 | 6.265 | 0.305 | -5.960 | 95.13% | 100% (2/2) |
| T3 Navigate to Google Maps (`นำทางไป Google Maps`) | 2 | 6.265 | 0.330 | -5.935 | 94.73% | 100% (2/2) |
| **Overall Average** | **2** | **6.265** | **0.437** | **-5.828** | **93.03%** | **100% (6/6)** |

## 5. Calculation Method

* **Per-Task Mean Time (`C15`, `D15`):** `=AVERAGE(C3:C4)` (`1st test`) and `=AVERAGE(D3:D4)` (`2nd test`)
* **Per-Task Success Rate (`E15`):** `=(COUNTIF(E3:E4,"pass")/COUNTA(E3:E4))*100`
* **Percentage Time Reduction (`C16` / `C17`):**
  `% Reduction = ((1st_test_mean - 2nd_test_mean) / 1st_test_mean) * 100`
* **Overall Average Across All 3 Tasks (`Result` Row 9):**
  `Overall Mean Time = (0.675 + 0.305 + 0.330) / 3 = 0.436666667 ≈ 0.437 min`
## 6. Data Limitations Observed in Workbook

1. **Sample Size & Subgroup Coverage:** Only 2 participants (`U01`, `U02`) 
2. **Identical `1st test` Times:** `1st test` values for `U01` (`3.24`) and `U02` (`9.29`) are identical across all three task worksheets, reflecting the guided walkthrough and assisted trial period.
3. **Time Format:** Time values are stored in Excel under `General` format (calculated as decimal minutes), while all fractional parts are $< 0.60$.
4. **Baseline Label Terminology:** The `BEFORE / OLD WAY` column in the `Result` worksheet (`6.265` min) represents the guided `1st test` mean time defined in the task worksheets rather than an unassisted pre-system baseline.