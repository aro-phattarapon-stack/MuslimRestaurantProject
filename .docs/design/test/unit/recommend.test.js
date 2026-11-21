import { describe, expect, it } from "vitest";
import { restaurants } from "../../../../src/services/restaurants";
import {
  parseRecommendationPrompt,
  recommendRestaurants,
} from "../../../../src/utils/recommend";

describe("restaurant search and recommendation", () => {
  it("exports 267 bundled restaurant records", () => {
    expect(restaurants).toHaveLength(267);
  });

  it("returns all 267 records for an empty query and default zone", () => {
    const results = recommendRestaurants(restaurants, {
      query: "",
      zone: "ALL",
      cuisine: "ทั้งหมด",
      maxBudget: 2000,
    });
    expect(results).toHaveLength(267);
  });

  it("finds a restaurant by an English name keyword", () => {
    const results = recommendRestaurants(restaurants, {
      query: "786",
      zone: "ALL",
      cuisine: "ทั้งหมด",
      maxBudget: 2000,
    });
    expect(results.some((restaurant) => restaurant.name.includes("786"))).toBe(true);
  });

  it("filters Mae Sai locations using English and Thai location keywords", () => {
    const englishResults = recommendRestaurants(restaurants, {
      zone: "MAESAI",
      cuisine: "ทั้งหมด",
      maxBudget: 2000,
    });
    const thaiResults = recommendRestaurants(restaurants, {
      query: "แม่สาย",
      zone: "ALL",
      cuisine: "ทั้งหมด",
      maxBudget: 2000,
    });

    expect(englishResults.length).toBeGreaterThan(0);
    expect(englishResults.every((restaurant) => restaurant.zone === "MAESAI")).toBe(true);
    expect(thaiResults.length).toBeGreaterThan(0);
  });

  it("rejects every record when openNow is enabled", () => {
    expect(recommendRestaurants(restaurants, { openNow: true })).toHaveLength(0);
  });

  it("parses Thai and English zone, budget, and cuisine phrases", () => {
    expect(parseRecommendationPrompt("ร้านใกล้แม่สาย งบไม่เกิน 150 บาท กาแฟ")).toEqual(
      expect.objectContaining({
        zone: "MAESAI",
        maxBudget: 150,
        cuisine: "ร้านกาแฟ",
      }),
    );
    expect(parseRecommendationPrompt("Mae Sai noodle under 200 baht")).toEqual(
      expect.objectContaining({
        zone: "MAESAI",
        maxBudget: 200,
        cuisine: "ก๋วยเตี๋ยว",
      }),
    );
  });

  it("uses minimum price for budget filtering", () => {
    const sample = [
      {
        id: 1,
        name: "Low price",
        district: "เชียงราย",
        province: "Chiang Rai",
        cuisine: "อาหารไทย",
        minPrice: 80,
      },
      {
        id: 2,
        name: "High price",
        district: "เชียงราย",
        province: "Chiang Rai",
        cuisine: "อาหารไทย",
        minPrice: 300,
      },
    ];
    expect(
      recommendRestaurants(sample, {
        zone: "ALL",
        cuisine: "ทั้งหมด",
        maxBudget: 100,
      }).map((restaurant) => restaurant.name),
    ).toEqual(["Low price"]);
  });
});
