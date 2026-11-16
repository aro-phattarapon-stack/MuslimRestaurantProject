const normalize = (value) => String(value ?? "").normalize("NFC").toLocaleLowerCase();

function getRestaurantZone(restaurant) {
  const province = normalize(restaurant.province);
  const location = normalize([
    restaurant.area,
    restaurant.district,
    restaurant.province,
    restaurant.name
  ].join(" "));
  const isChiangRai = province.includes("chiang rai") ||
    province.includes("เชียงราย") ||
    location.includes("chiang rai") ||
    location.includes("เชียงราย");

  if (!isChiangRai || restaurant.otherProvince) return null;
  if (/mae fa luang|mae fah luang|มฟล|แม่ฟ้าหลวง/.test(location)) return "MFU";
  if (/mae sai|แม่สาย/.test(location)) return "MAESAI";
  if (/mueang chiang rai|muang chiang rai|ตัวเมือง|อำเภอเมือง|เมืองเชียงราย/.test(location)) return "CITY";
  return "OTHER";
}

function getMinimumPrice(restaurant) {
  if (typeof restaurant.minPrice === "number") return restaurant.minPrice;

  const match = String(restaurant.priceRange ?? "").match(/\d[\d,]*/);
  return match ? Number(match[0].replaceAll(",", "")) : undefined;
}

function matchesCuisine(restaurant, cuisine) {
  if (cuisine === "ทั้งหมด") return true;

  const details = normalize([
    restaurant.cuisine,
    restaurant.name,
    restaurant.description
  ].join(" "));
  const keywords = {
    "อาหารตามสั่ง": ["อาหารตามสั่ง", "ตามสั่ง", "จานเดียว", "à la carte"],
    "อาหารไทย": ["อาหารไทย", "ไทย", "thai", "ข้าวซอย", "กะเพรา", "ต้มยำ", "ส้มตำ"],
    "อาหารท้องถิ่น": ["ท้องถิ่น", "อาหารเหนือ", "ล้านนา", "เชียงราย", "ข้าวซอย"],
    "อาหารอาหรับ": ["อาหรับ", "arab", "middle eastern", "egypt", "อียิปต์"],
    "อาหารอินเดีย": ["อินเดีย", "indian", "india", "ปากีสถาน", "pakistani"],
    "อาหารมาเลเซีย": ["มาเลเซีย", "malaysia", "malaysian"],
    "ร้านกาแฟ": ["กาแฟ", "coffee", "cafe", "café", "คาเฟ่"],
    "ของหวาน": ["ของหวาน", "dessert", "sweet", "เบเกอรี่", "bakery", "ขนม", "ไอศกรีม", "บิงซู"],
    "โรตีและของหวาน": ["โรตี", "roti", "ของหวาน", "dessert", "sweet"],
    "อาหารฮาลาล": ["ฮาลาล", "halal", "muslim", "มุสลิม", "อิสลาม"]
  };
  const terms = keywords[cuisine] || [normalize(cuisine)];

  if (terms.some((term) => details.includes(normalize(term)))) return true;
  return cuisine === "อาหารฮาลาล" &&
    ["halal", "muslim-friendly"].includes(normalize(restaurant.halalStatus));
}

function getSearchableText(restaurant) {
  return normalize([
    restaurant.name,
    restaurant.district,
    restaurant.area,
    restaurant.province,
    restaurant.zone,
    restaurant.cuisine,
    restaurant.description,
    restaurant.priceRange,
    restaurant.halalStatus,
    ...(Array.isArray(restaurant.amenities) ? restaurant.amenities : []),
    ...(Array.isArray(restaurant.menu) ? restaurant.menu.map((item) => item?.name) : [])
  ].join(" "));
}

export function recommendRestaurants(restaurants, preferences = {}) {
  const {
    query = "",
    zone = "ALL",
    cuisine = "ทั้งหมด",
    maxBudget = 1000,
    openNow = false,
    includeUnverified = true
  } = preferences;

  const normalizedQuery = normalize(query.trim());

  const matches = restaurants
    .filter((restaurant) => {
      const restaurantZone = getRestaurantZone(restaurant);
      const minimumPrice = getMinimumPrice(restaurant);

      if (zone !== "ALL" && restaurantZone !== zone) return false;
      if (!matchesCuisine(restaurant, cuisine)) return false;
      if (minimumPrice !== undefined && minimumPrice > maxBudget) return false;
      if (!includeUnverified && !restaurant.verified) return false;
      if (openNow) return false;
      if (normalizedQuery && !getSearchableText(restaurant).includes(normalizedQuery)) return false;

      return true;
    })
    .map((restaurant) => {
      const restaurantZone = getRestaurantZone(restaurant);
      let score = 0;

      if (normalizedQuery && normalize(restaurant.name).includes(normalizedQuery)) score += 10;
      if (zone !== "ALL" && restaurantZone === zone) score += 5;
      if (cuisine !== "ทั้งหมด" && matchesCuisine(restaurant, cuisine)) score += 5;
      if (restaurant.verified) score += 3;

      return {
        ...restaurant,
        zone: restaurantZone,
        district: restaurant.district || restaurant.area || restaurant.province || "ไม่ระบุพื้นที่",
        cuisine: restaurant.cuisine || "ไม่ระบุประเภท",
        priceLevel: restaurant.priceLevel || restaurant.priceRange || "ราคาไม่ระบุ",
        openingHours: restaurant.openingHours || restaurant.openingNote || "ไม่ระบุเวลา",
        matchScore: score
      };
    });

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

export function parseRecommendationPrompt(prompt) {
  const normalizedPrompt = normalize(prompt);
  const preferences = {};

  if (/มฟล|แม่ฟ้าหลวง|mfu|mae fah luang|mae fa luang/.test(normalizedPrompt)) {
    preferences.zone = "MFU";
  } else if (/แม่สาย|mae sai/.test(normalizedPrompt)) {
    preferences.zone = "MAESAI";
  } else if (/ตัวเมือง|อำเภอเมือง|เมืองเชียงราย|mueang chiang rai|muang chiang rai|chiang rai city/.test(normalizedPrompt)) {
    preferences.zone = "CITY";
  } else if (/อำเภออื่น|เชียงแสน|แม่จัน|แม่สรวย|เวียงป่าเป้า|พญาเม็งราย|phaya mengrai|chiang saen|mae chan|mae suai|wiang pa pao/.test(normalizedPrompt)) {
    preferences.zone = "OTHER";
  }

  const budgetMatch = normalizedPrompt.match(
    /(?:ไม่เกิน|ต่ำกว่า|น้อยกว่า|งบ(?:ประมาณ)?(?:ไม่เกิน)?|budget(?:\s*(?:under|below|max))?|under|below)\s*[:=]?\s*(\d{2,5})|฿\s*(\d{2,5})|(\d{2,5})\s*(?:บาท|baht)/i
  );
  const budget = budgetMatch?.slice(1).find(Boolean);
  if (budget) preferences.maxBudget = Number(budget);

  const cuisineAliases = [
    ["โรตีและของหวาน", /โรตี|roti/],
    ["อาหารอาหรับ", /อาหรับ|arab|middle eastern|egypt|อียิปต์/],
    ["อาหารอินเดีย", /อินเดีย|indian|india|ปากีสถาน|pakistani/],
    ["อาหารมาเลเซีย", /มาเลเซีย|malaysia|malaysian/],
    ["ร้านกาแฟ", /กาแฟ|coffee|cafe|café|คาเฟ่/],
    ["ของหวาน", /ของหวาน|dessert|sweet|เบเกอรี่|bakery|ขนม|ไอศกรีม|บิงซู/],
    ["อาหารตามสั่ง", /อาหารตามสั่ง|ตามสั่ง|จานเดียว/],
    ["อาหารท้องถิ่น", /อาหารท้องถิ่น|อาหารเหนือ|ล้านนา|ข้าวซอย/],
    ["อาหารไทย", /อาหารไทย|อาหารไทย|thai|กะเพรา|ต้มยำ|ส้มตำ/],
    ["อาหารฮาลาล", /ฮาลาล|halal|muslim|มุสลิม|อิสลาม/]
  ];
  const cuisine = cuisineAliases.find(([, pattern]) => pattern.test(normalizedPrompt));
  if (cuisine) preferences.cuisine = cuisine[0];

  return preferences;
}
