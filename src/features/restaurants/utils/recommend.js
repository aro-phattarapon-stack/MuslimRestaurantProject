const normalize = (value) => String(value ?? "").normalize("NFC").toLocaleLowerCase().replace(/\s+/g, " ").trim();
const defaultOpeningHours = "08:00–18:00 น.";

const searchAliases = [
  [["ก๋วยเตี๋ยว", "ก๋วย", "noodle", "noodles"], "ก๋วยเตี๋ยว"],
  [["กาแฟ", "coffee", "cafe", "café", "คาเฟ่"], "ร้านกาแฟ"],
  [["ของหวาน", "dessert", "sweet", "เบเกอรี่", "bakery", "ขนม", "ไอศกรีม", "บิงซู"], "ของหวาน"],
  [["โรตี", "roti"], "โรตีและของหวาน"],
  [["ฮาลาล", "halal", "muslim", "มุสลิม", "อิสลาม"], "อาหารฮาลาล"],
  [["แม่สาย", "mae sai"], "แม่สาย"],
  [["มฟล", "แม่ฟ้าหลวง", "mfu", "mae fah luang", "mae fa luang"], "รอบ มฟล."],
  [["ตัวเมือง", "อำเภอเมือง", "เมืองเชียงราย", "mueang chiang rai", "chiang rai city"], "ตัวเมืองเชียงราย"]
];

// 1. ปรับปรุงการระบุโซนให้ครอบคลุมแลนด์มาร์กและตำบลสำคัญในเชียงราย
function getRestaurantZone(restaurant) {
  if (restaurant.zone && ["MFU", "MAESAI", "CITY", "OTHER"].includes(restaurant.zone)) {
    return restaurant.zone;
  }

  const province = normalize(restaurant.province);
  const location = normalize([
    restaurant.area,
    restaurant.district,
    restaurant.subdistrict,
    restaurant.province,
    restaurant.address,
    restaurant.name
  ].join(" "));

  const isChiangRai =
    province.includes("chiang rai") ||
    province.includes("เชียงราย") ||
    location.includes("chiang rai") ||
    location.includes("เชียงราย");

  if (!isChiangRai || restaurant.otherProvince) return null;

  if (/mae fa luang|mae fah luang|มฟล|แม่ฟ้าหลวง|นางแล|nang lae|ท่าสุด|tha sut|บ้านดู่|ban du/.test(location)) {
    return "MFU";
  }
  if (/mae sai|แม่สาย|ด่านแม่สาย|ผาหมี|pha mee/.test(location)) {
    return "MAESAI";
  }
  if (/mueang chiang rai|muang chiang rai|ตัวเมือง|อำเภอเมือง|เมืองเชียงราย|หอนาฬิกา|ไนท์บาซาร์|night bazaar|สันโค้ง|ริมกก|เซ็นทรัล|central/.test(location)) {
    return "CITY";
  }
  return "OTHER";
}

function getMinimumPrice(restaurant) {
  if (typeof restaurant.minPrice === "number") return restaurant.minPrice;

  const match = String(restaurant.priceRange ?? "").match(/\d[\d,]*/);
  return match ? Number(match[0].replaceAll(",", "")) : undefined;
}

function matchesCuisine(restaurant, cuisine) {
  if (!cuisine || cuisine === "ทั้งหมด") return true;

  const details = normalize([
    restaurant.cuisine,
    restaurant.name,
    restaurant.description,
    ...(Array.isArray(restaurant.menu) ? restaurant.menu.map((m) => m?.name) : [])
  ].join(" "));

  const keywords = {
<<<<<<< HEAD
    "ก๋วยเตี๋ยว": ["ก๋วยเตี๋ยว", "ก๋วย", "noodle", "noodles"],
    "อาหารตามสั่ง": ["อาหารตามสั่ง", "ตามสั่ง", "จานเดียว", "à la carte"],
    "อาหารไทย": ["อาหารไทย", "ไทย", "thai", "ข้าวซอย", "กะเพรา", "ต้มยำ", "ส้มตำ"],
    "อาหารท้องถิ่น": ["ท้องถิ่น", "อาหารเหนือ", "ล้านนา", "เชียงราย", "ข้าวซอย"],
    "อาหารอาหรับ": ["อาหรับ", "arab", "middle eastern", "egypt", "อียิปต์"],
    "อาหารอินเดีย": ["อินเดีย", "indian", "india", "ปากีสถาน", "pakistani"],
    "อาหารมาเลเซีย": ["มาเลเซีย", "malaysia", "malaysian"],
    "ร้านกาแฟ": ["กาแฟ", "coffee", "cafe", "café", "คาเฟ่"],
    "ของหวาน": ["ของหวาน", "dessert", "sweet", "เบเกอรี่", "bakery", "ขนม", "ไอศกรีม", "บิงซู"],
    "โรตีและของหวาน": ["โรตี", "roti", "ของหวาน", "dessert", "sweet"],
=======
    "อาหารตามสั่ง": ["อาหารตามสั่ง", "ตามสั่ง", "จานเดียว", "à la carte", "กะเพรา", "ข้าวผัด"],
    "อาหารไทย": ["อาหารไทย", "ไทย", "thai", "ข้าวซอย", "กะเพรา", "ต้มยำ", "ส้มตำ", "ก๋วยเตี๋ยว"],
    "อาหารท้องถิ่น": ["ท้องถิ่น", "อาหารเหนือ", "ล้านนา", "เชียงราย", "ข้าวซอย", "น้ำเงี้ยว", "ลาบ"],
    "อาหารอาหรับ": ["อาหรับ", "arab", "middle eastern", "egypt", "อียิปต์", "เคบับ", "kebab", "shawarma", "ชวาร์มา", "มัสมั่น"],
    "อาหารอินเดีย": ["อินเดีย", "indian", "india", "ปากีสถาน", "pakistani", "biryani", "ข้าวหมก", "นาน", "naan", "แกงกะหรี่"],
    "อาหารมาเลเซีย": ["มาเลเซีย", "malaysia", "malaysian", "นาซีเลอมัก", "nasi lemak", "ชาชัก", "teh tarik"],
    "ร้านกาแฟ": ["กาแฟ", "coffee", "cafe", "café", "คาเฟ่", "มัทฉะ", "matcha", "เครื่องดื่ม"],
    "ของหวาน": ["ของหวาน", "dessert", "sweet", "เบเกอรี่", "bakery", "ขนม", "ไอศกรีม", "บิงซู", "เค้ก"],
    "โรตีและของหวาน": ["โรตี", "roti", "ของหวาน", "dessert", "sweet", "ชาชัก", "มะตะบะ"],
>>>>>>> 4e1c4aa (edit searchbar)
    "อาหารฮาลาล": ["ฮาลาล", "halal", "muslim", "มุสลิม", "อิสลาม"]
  };

  const terms = keywords[cuisine] || [normalize(cuisine)];
  if (terms.some((term) => details.includes(normalize(term)))) return true;

  return (
    cuisine === "อาหารฮาลาล" &&
    ["halal", "muslim-friendly", "certified"].includes(normalize(restaurant.halalStatus))
  );
}

// 2. ตรวจสอบเวลาเปิด-ปิดเบื้องต้น (รองรับรูปแบบ "08:00 - 20:00" หรือ "08:00-20:00")
function isRestaurantOpenNow(restaurant) {
  const rawHours = String(restaurant.openingHours || restaurant.openingNote || "");
  if (!rawHours || rawHours.includes("24")) return true; // ถ้าไม่ระบุหรือเปิด 24 ชม. ให้ผ่านไปก่อน

  const timeMatch = rawHours.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/);
  if (!timeMatch) return true; // ถ้ารูปแบบเวลาซับซ้อน ไม่ตัดร้านทิ้ง

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const openMinutes = Number(timeMatch[1]) * 60 + Number(timeMatch[2]);
  let closeMinutes = Number(timeMatch[3]) * 60 + Number(timeMatch[4]);

  // กรณีร้านเปิดข้ามคืน เช่น 17:00 - 02:00
  if (closeMinutes < openMinutes) {
    closeMinutes += 24 * 60;
    const adjustedCurrent = currentMinutes < openMinutes ? currentMinutes + 24 * 60 : currentMinutes;
    return adjustedCurrent >= openMinutes && adjustedCurrent <= closeMinutes;
  }

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

function getSearchableText(restaurant) {
  return normalize([
    restaurant.name,
    restaurant.nameTh,
    restaurant.nameEn,
    restaurant.district,
    restaurant.area,
    restaurant.province,
    restaurant.zone,
    restaurant.cuisine,
    restaurant.description,
    restaurant.priceRange,
    restaurant.halalStatus,
<<<<<<< HEAD
=======
    ...(Array.isArray(restaurant.tags) ? restaurant.tags : []),
    ...(Array.isArray(restaurant.amenities) ? restaurant.amenities : []),
>>>>>>> 4e1c4aa (edit searchbar)
    ...(Array.isArray(restaurant.menu) ? restaurant.menu.map((item) => item?.name) : [])
  ].join(" "));
}

<<<<<<< HEAD
function getQueryTerms(query) {
  const normalizedQuery = normalize(query);
  const aliases = searchAliases
    .filter(([terms]) => terms.some((term) => normalizedQuery.includes(normalize(term))))
    .map(([, label]) => label);
  const plainTerms = normalizedQuery
    .split(/[\s,，、/]+/)
    .filter((term) => term.length > 1);
  return [...new Set([...aliases, ...plainTerms])];
}

=======
// 3. ระบบคัดกรองและจัดอันดับอัจฉริยะ (Smart Token Matching + Weighted Scoring)
>>>>>>> 4e1c4aa (edit searchbar)
export function recommendRestaurants(restaurants, preferences = {}) {
  const {
    query = "",
    zone = "ALL",
    cuisine = "ทั้งหมด",
    maxBudget = 1000,
    openNow = false,
    includeUnverified = true,
    halalOnly = false,
    requiredAmenities = []
  } = preferences;

<<<<<<< HEAD
  const queryTerms = getQueryTerms(query);
=======
  const normalizedQuery = normalize(query.trim());
  // แยกคำค้นหาเป็นคำย่อยๆ (Tokens) เพื่อรองรับการพิมพ์หลายคำที่ไม่ติดกัน
  const queryTokens = normalizedQuery
    .split(/\s+/)
    .filter((token) => token.length > 1 && !["ร้าน", "อาหาร", "แถว", "ย่าน", "ที่", "ใน", "และ", "กับ"].includes(token));
>>>>>>> 4e1c4aa (edit searchbar)

  const matches = restaurants
    .filter((restaurant) => {
      const restaurantZone = getRestaurantZone(restaurant);
      const minimumPrice = getMinimumPrice(restaurant);

      if (zone !== "ALL" && restaurantZone !== zone) return false;
      if (!matchesCuisine(restaurant, cuisine)) return false;
      if (minimumPrice !== undefined && minimumPrice > maxBudget) return false;
      if (!includeUnverified && !restaurant.verified) return false;
<<<<<<< HEAD
      if (openNow) return false;
      const searchableText = getSearchableText(restaurant);
      if (queryTerms.length && !queryTerms.every((term) => searchableText.includes(normalize(term)))) return false;
=======
      if (halalOnly && normalize(restaurant.halalStatus) !== "halal" && !restaurant.verified) return false;
      if (openNow && !isRestaurantOpenNow(restaurant)) return false;

      // ตรวจสอบสิ่งอำนวยความสะดวกที่ AI สกัดมาได้ (เช่น ที่ละหมาด, ที่จอดรถ)
      if (requiredAmenities.length > 0) {
        const amenityText = normalize([
          ...(Array.isArray(restaurant.amenities) ? restaurant.amenities : []),
          restaurant.description
        ].join(" "));
        const hasAllAmenities = requiredAmenities.every((req) => amenityText.includes(normalize(req)));
        if (!hasAllAmenities) return false;
      }

      // ค้นหาแบบ Token: ถ้ามีคำค้นหา ต้องมีอย่างน้อย 1 คำที่ตรงกับข้อมูลร้าน (และถ้าคำสั้นให้ตรงทั้งหมด)
      if (queryTokens.length > 0) {
        const searchable = getSearchableText(restaurant);
        const matchedCount = queryTokens.filter((token) => searchable.includes(token)).length;
        if (matchedCount === 0) return false;
      } else if (normalizedQuery && !getSearchableText(restaurant).includes(normalizedQuery)) {
        return false;
      }
>>>>>>> 4e1c4aa (edit searchbar)

      return true;
    })
    .map((restaurant) => {
      const restaurantZone = getRestaurantZone(restaurant);
      const minimumPrice = getMinimumPrice(restaurant);
      const normalizedName = normalize(restaurant.name);
      const searchable = getSearchableText(restaurant);

      let score = 0;

<<<<<<< HEAD
      if (queryTerms.length) {
        const name = normalize(restaurant.name);
        score += queryTerms.reduce((total, term) => total + (name.includes(normalize(term)) ? 10 : 0), 0);
      }
      if (zone !== "ALL" && restaurantZone === zone) score += 5;
      if (cuisine !== "ทั้งหมด" && matchesCuisine(restaurant, cuisine)) score += 5;
      if (restaurant.verified) score += 3;
=======
      // คะแนนความตรงของคำค้นหา (Query Relevance)
      if (normalizedQuery) {
        if (normalizedName === normalizedQuery) score += 25; // ชื่อตรงเป๊ะ
        else if (normalizedName.includes(normalizedQuery)) score += 15; // มีคำค้นหาในชื่อร้าน

        // ให้คะแนนตามสัดส่วนจำนวนคำย่อยที่เจอ
        if (queryTokens.length > 0) {
          const matchedTokens = queryTokens.filter((token) => searchable.includes(token));
          score += (matchedTokens.length / queryTokens.length) * 12;
        }
      }

      // คะแนนความตรงของเงื่อนไขหลัก
      if (zone !== "ALL" && restaurantZone === zone) score += 6;
      if (cuisine !== "ทั้งหมด" && matchesCuisine(restaurant, cuisine)) score += 6;

      // คะแนนความน่าเชื่อถือฮาลาล
      if (restaurant.verified) score += 5;
      if (normalize(restaurant.halalStatus) === "halal") score += 3;

      // คะแนนความคุ้มค่าเทียบกับงบประมาณ (ยิ่งถูกกว่างบ ยิ่งได้คะแนนเพิ่มเล็กน้อย)
      if (minimumPrice !== undefined && maxBudget < 2000 && minimumPrice <= maxBudget) {
        score += 2;
      }

      // คะแนนรีวิว (ถ้ามีในข้อมูล)
      if (typeof restaurant.rating === "number") {
        score += restaurant.rating;
      }
>>>>>>> 4e1c4aa (edit searchbar)

      return {
        ...restaurant,
        zone: restaurantZone,
        district: restaurant.district || restaurant.area || restaurant.province || "ไม่ระบุพื้นที่",
        cuisine: restaurant.cuisine || "ไม่ระบุประเภท",
        priceLevel: restaurant.priceLevel || restaurant.priceRange || "ราคาไม่ระบุ",
<<<<<<< HEAD
        openingHours: defaultOpeningHours,
        matchScore: score
=======
        openingHours: restaurant.openingHours || restaurant.openingNote || "ไม่ระบุเวลา",
        matchScore: Math.round(score * 10) / 10
>>>>>>> 4e1c4aa (edit searchbar)
      };
    });

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

// 4. ระบบสกัดเจตนาจากภาษาธรรมชาติ (Smart Client-side NLP Parser)
export function parseRecommendationPrompt(prompt) {
  const normalizedPrompt = normalize(prompt);
  const preferences = {
    requiredAmenities: []
  };

  // สกัดโซนพื้นที่เชียงราย (รวมแลนด์มาร์กยอดนิยม)
  if (/มฟล|แม่ฟ้าหลวง|mfu|mae fah luang|mae fa luang|นางแล|ท่าสุด|บ้านดู่/.test(normalizedPrompt)) {
    preferences.zone = "MFU";
  } else if (/แม่สาย|mae sai|ด่านแม่สาย|ผาหมี/.test(normalizedPrompt)) {
    preferences.zone = "MAESAI";
  } else if (/ตัวเมือง|อำเภอเมือง|เมืองเชียงราย|mueang chiang rai|muang chiang rai|chiang rai city|หอนาฬิกา|ไนท์บาซาร์|สันโค้ง|ริมกก|เซ็นทรัล/.test(normalizedPrompt)) {
    preferences.zone = "CITY";
  } else if (/อำเภออื่น|เชียงแสน|แม่จัน|แม่สรวย|เวียงป่าเป้า|พญาเม็งราย|phaya mengrai|chiang saen|mae chan|mae suai|wiang pa pao/.test(normalizedPrompt)) {
    preferences.zone = "OTHER";
  }

  // สกัดงบประมาณ (รวมคำเชิงความหมาย เช่น "ถูกๆ", "ประหยัด", "หรู")
  const budgetMatch = normalizedPrompt.match(
    /(?:ไม่เกิน|ต่ำกว่า|น้อยกว่า|งบ(?:ประมาณ)?(?:ไม่เกิน)?|budget(?:\s*(?:under|below|max))?|under|below)\s*[:=]?\s*(\d{2,5})|฿\s*(\d{2,5})|(\d{2,5})\s*(?:บาท|baht)/i
  );
  const budget = budgetMatch?.slice(1).find(Boolean);
  if (budget) {
    preferences.maxBudget = Number(budget);
  } else if (/ประหยัด|ถูกๆ|ราคาถูก|ไม่แพง|cheap|budget/.test(normalizedPrompt)) {
    preferences.maxBudget = 100;
  } else if (/ปานกลาง|กลางๆ|moderate/.test(normalizedPrompt)) {
    preferences.maxBudget = 300;
  }

  // สกัดประเภทอาหาร
  const cuisineAliases = [
<<<<<<< HEAD
    ["ก๋วยเตี๋ยว", /ก๋วยเตี๋ยว|ก๋วย|noodle|noodles/],
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
=======
    ["โรตีและของหวาน", /โรตี|roti|มะตะบะ|ชาชัก/],
    ["อาหารอาหรับ", /อาหรับ|arab|middle eastern|egypt|อียิปต์|เคบับ|ชวาร์มา/],
    ["อาหารอินเดีย", /อินเดีย|indian|india|ปากีสถาน|pakistani|ข้าวหมก|biryani|นาน/],
    ["อาหารมาเลเซีย", /มาเลเซีย|malaysia|malaysian|นาซีเลอมัก/],
    ["ร้านกาแฟ", /กาแฟ|coffee|cafe|café|คาเฟ่|มัทฉะ/],
    ["ของหวาน", /ของหวาน|dessert|sweet|เบเกอรี่|bakery|ขนม|ไอศกรีม|บิงซู|เค้ก/],
    ["อาหารตามสั่ง", /อาหารตามสั่ง|ตามสั่ง|จานเดียว|กะเพรา|ข้าวผัด/],
    ["อาหารท้องถิ่น", /อาหารท้องถิ่น|อาหารเหนือ|ล้านนา|ข้าวซอย|น้ำเงี้ยว/],
    ["อาหารไทย", /อาหารไทย|thai|ต้มยำ|ส้มตำ|ก๋วยเตี๋ยว/],
    ["อาหารฮาลาล", /อาหารฮาลาล|ฮาลาล|halal|muslim|มุสลิม/]
>>>>>>> 4e1c4aa (edit searchbar)
  ];
  const cuisine = cuisineAliases.find(([, pattern]) => pattern.test(normalizedPrompt));
  if (cuisine) preferences.cuisine = cuisine[0];

  // สกัดเงื่อนไขพิเศษ (เวลาเปิด, ความน่าเชื่อถือ, สิ่งอำนวยความสะดวก)
  if (/เปิดตอนนี้|เปิดอยู่|หิวตอนนี้|open now/.test(normalizedPrompt)) {
    preferences.openNow = true;
  }
  if (/ฮาลาล\s*100|รับรองฮาลาล|มีตราฮาลาล|verified|certified/.test(normalizedPrompt)) {
    preferences.includeUnverified = false;
    preferences.halalOnly = true;
  }
  if (/ละหมาด|prayer|surau|มัสยิด/.test(normalizedPrompt)) {
    preferences.requiredAmenities.push("ละหมาด");
  }
  if (/จอดรถ|parking/.test(normalizedPrompt)) {
    preferences.requiredAmenities.push("จอดรถ");
  }
  if (/แอร์|air/.test(normalizedPrompt)) {
    preferences.requiredAmenities.push("แอร์");
  }

  // สกัดเมนูเฉพาะเจาะจงเป็น keyword เพื่อให้ค้นหาเมนูได้แม่นยำขึ้น
  const specificDishes = ["ข้าวซอย", "ข้าวหมก", "โรตี", "เนื้อย่าง", "ชาบู", "ปิ้งย่าง", "ก๋วยเตี๋ยว", "ส้มตำ", "เคบับ", "มัสมั่น"];
  const foundDish = specificDishes.find((dish) => normalizedPrompt.includes(dish));
  if (foundDish) {
    preferences.keyword = foundDish;
  }

  return preferences;
}