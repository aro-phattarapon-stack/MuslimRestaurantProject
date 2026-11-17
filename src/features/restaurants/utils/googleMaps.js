function getCoordinate(value, minimum, maximum) {
  const coordinate = Number(value);
  return Number.isFinite(coordinate) && coordinate >= minimum && coordinate <= maximum
    ? coordinate
    : null;
}

export function getRestaurantCoordinates(restaurant) {
  const latitude = getCoordinate(restaurant?.latitude, -90, 90);
  const longitude = getCoordinate(restaurant?.longitude, -180, 180);

  return latitude === null || longitude === null
    ? null
    : { latitude, longitude };
}

function getRestaurantLabel(restaurant) {
  return [
    restaurant?.name,
    restaurant?.address,
    restaurant?.district || restaurant?.area,
    restaurant?.province || "Chiang Rai",
    "Thailand"
  ]
    .filter(Boolean)
    .join(", ");
}

export function getGoogleMapsUrl(restaurant) {
  const coordinates = getRestaurantCoordinates(restaurant);

  if (coordinates) {
    const params = new URLSearchParams({
      api: "1",
      destination: `${coordinates.latitude},${coordinates.longitude}`,
      travelmode: "driving"
    });
    return `https://www.google.com/maps/dir/?${params.toString()}`;
  }

  const params = new URLSearchParams({
    api: "1",
    query: getRestaurantLabel(restaurant)
  });

  return `https://www.google.com/maps/search/?${params.toString()}`;
}

export function openGoogleMaps(restaurant) {
  const url = getGoogleMapsUrl(restaurant);

  window.open(url, "_blank", "noopener,noreferrer");
}