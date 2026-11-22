import { performance } from "node:perf_hooks";
import { restaurants } from "../src/services/restaurants.js";
import {
  parseRecommendationPrompt,
  recommendRestaurants,
} from "../src/utils/recommend.js";

const cases = [
  {
    id: "AI-NAME-786",
    description: "English/numeric restaurant-name search",
    preferences: { query: "786", zone: "ALL", cuisine: "ทั้งหมด", maxBudget: 2000 },
    expectation: "786 Islamic Restaurant",
  },
  {
    id: "AI-AREA-MAESAI-TH",
    description: "Thai Mae Sai location search",
    preferences: { query: "แม่สาย", zone: "ALL", cuisine: "ทั้งหมด", maxBudget: 2000 },
    expectation: "nonempty",
  },
  {
    id: "AI-AREA-MAESAI-EN",
    description: "Mae Sai zone filter",
    preferences: { zone: "MAESAI", cuisine: "ทั้งหมด", maxBudget: 2000 },
    expectation: "nonempty",
  },
  {
    id: "AI-CATEGORY-EN",
    description: "English category search",
    preferences: { query: "coffee", zone: "ALL", cuisine: "ทั้งหมด", maxBudget: 2000 },
    expectation: "nonempty",
  },
  {
    id: "AI-CATEGORY-TH",
    description: "Thai category search",
    preferences: { query: "ฮาลาล", zone: "ALL", cuisine: "ทั้งหมด", maxBudget: 2000 },
    expectation: "nonempty",
  },
  {
    id: "AI-MULTI",
    description: "Multiple Mae Sai cafe and budget conditions",
    preferences: { zone: "MAESAI", cuisine: "ร้านกาแฟ", maxBudget: 200 },
    expectation: "nonempty",
  },
  {
    id: "AI-NOMATCH",
    description: "No matching query",
    preferences: { query: "zzzz-no-match", zone: "ALL", cuisine: "ทั้งหมด", maxBudget: 2000 },
    expectation: "empty",
  },
  {
    id: "AI-EMPTY",
    description: "Empty query",
    preferences: { query: "", zone: "ALL", cuisine: "ทั้งหมด", maxBudget: 2000 },
    expectation: "all",
  },
  {
    id: "AI-OPENNOW",
    description: "Open-now parameter",
    preferences: { openNow: true, zone: "ALL", cuisine: "ทั้งหมด", maxBudget: 2000 },
    expectation: "empty",
  },
  {
    id: "AI-HALALONLY",
    description: "Passed halalOnly parameter",
    preferences: { halalOnly: true, zone: "ALL", cuisine: "ทั้งหมด", maxBudget: 2000 },
    expectation: "all",
  },
];

function normalize(value) {
  return String(value ?? "").toLocaleLowerCase().trim();
}

function basicSubstringBaseline(preferences) {
  const query = normalize(preferences.query);
  if (!query) return restaurants;

  return restaurants.filter((restaurant) =>
    [
      restaurant.name,
      restaurant.district,
      restaurant.area,
      restaurant.cuisine,
      restaurant.description,
    ].some((value) => normalize(value).includes(query)),
  );
}

const durations = [];
const rows = [];

for (const testCase of cases) {
  const start = performance.now();
  const results = recommendRestaurants(restaurants, testCase.preferences);
  const duration = performance.now() - start;
  durations.push(duration);

  const passed =
    testCase.expectation === "all"
      ? results.length === restaurants.length
      : testCase.expectation === "empty"
        ? results.length === 0
        : testCase.expectation === "nonempty"
          ? results.length > 0
          : results.some((restaurant) => restaurant.name === testCase.expectation);

  rows.push({
    id: testCase.id,
    description: testCase.description,
    returned: results.length,
    passed,
  });
}

const passed = rows.filter((row) => row.passed).length;
const empty = rows.filter((row) => row.returned === 0).length;
const averageMs = durations.reduce((sum, value) => sum + value, 0) / durations.length;
const sortedDurations = [...durations].sort((a, b) => a - b);
const p95Index = Math.min(sortedDurations.length - 1, Math.ceil(sortedDurations.length * 0.95) - 1);

console.log("Halal Chiang Rai Recommendation Evaluation");
console.log(`Dataset size: ${restaurants.length}`);
console.log("");
console.log("Test results:");
for (const row of rows) {
  console.log(
    `${row.id} | ${row.description} | returned=${row.returned} | ${row.passed ? "PASS" : "FAIL"}`,
  );
}
console.log("");
console.log("Implemented-system metrics:");
console.log(`Success/expectation rate: ${passed}/${rows.length} (${((passed / rows.length) * 100).toFixed(2)}%)`);
console.log(`Empty result rate: ${empty}/${rows.length} (${((empty / rows.length) * 100).toFixed(2)}%)`);
console.log(`Average response time: ${averageMs.toFixed(3)} ms`);
console.log(`P95 response time: ${sortedDurations[p95Index].toFixed(3)} ms`);

const baselineCases = cases.filter((testCase) => testCase.preferences.query);
let baselineSuccesses = 0;
for (const testCase of baselineCases) {
  const baselineResults = basicSubstringBaseline(testCase.preferences);
  const passedBaseline =
    testCase.expectation === "empty"
      ? baselineResults.length === 0
      : testCase.expectation === "nonempty"
        ? baselineResults.length > 0
        : baselineResults.some((restaurant) => restaurant.name === testCase.expectation);
  if (passedBaseline) baselineSuccesses += 1;
}

console.log("");
console.log("Proposed basic-substring baseline (executed by this script):");
console.log(`Success/expectation rate: ${baselineSuccesses}/${baselineCases.length}`);

const thaiPrompt = parseRecommendationPrompt(
  "ร้านใกล้แม่สาย งบไม่เกิน 150 บาท กาแฟ",
);
const englishPrompt = parseRecommendationPrompt(
  "Mae Sai noodle under 200 baht",
);
console.log("");
console.log("Prompt parsing:");
console.log(`Thai prompt: ${JSON.stringify(thaiPrompt)}`);
console.log(`English prompt: ${JSON.stringify(englishPrompt)}`);

console.log("");
console.log("Precision@K and Recall@K: not calculated; relevance labels are unavailable.");
