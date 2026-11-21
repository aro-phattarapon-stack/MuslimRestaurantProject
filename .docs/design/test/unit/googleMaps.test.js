import { describe, expect, it } from "vitest";
import {
  getGoogleMapsUrl,
  getRestaurantCoordinates,
} from "../../../../src/utils/googleMaps";

describe("Google Maps URL helper", () => {
  it("returns coordinates for valid latitude and longitude", () => {
    expect(
      getRestaurantCoordinates({
        latitude: 19.9105,
        longitude: 99.8406,
      }),
    ).toEqual({
      latitude: 19.9105,
      longitude: 99.8406,
    });
  });

  it("uses coordinate directions when coordinates are valid", () => {
    const url = getGoogleMapsUrl({
      latitude: 19.9105,
      longitude: 99.8406,
    });
    expect(url).toContain("https://www.google.com/maps/dir/");
    expect(url).toContain("destination=19.9105%2C99.8406");
  });

  it("falls back to a text search for missing coordinates", () => {
    const url = getGoogleMapsUrl({
      name: "Sample Restaurant",
      district: "Mueang Chiang Rai",
      province: "Chiang Rai",
    });
    expect(url).toContain("https://www.google.com/maps/search/");
    expect(url).toContain("query=");
  });
});
