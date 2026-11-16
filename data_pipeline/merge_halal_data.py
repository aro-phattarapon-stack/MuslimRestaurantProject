import sqlite3
import pandas as pd
import re
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
db_path = BASE_DIR / "halal.db"

conn = sqlite3.connect(db_path)

df_g = pd.read_sql("SELECT * FROM google_restaurants", conn)
df_o = pd.read_sql("SELECT * FROM overpass_restaurants", conn)
df_w = pd.read_sql("SELECT * FROM wongnai_restaurants", conn)
df_r = pd.read_sql("SELECT * FROM research_restaurants", conn)

def make_merge_key(text):
    if pd.isna(text): return ""
    raw = str(text).lower().strip()
    cleaned = re.sub(r'(ร้านอาหาร|ร้าน|\(ฮาลาล\)|ฮาลาล|halal|restaurant|food|-สาขา.*)', '', raw)
    cleaned = re.sub(r'(อาหารมุสลิม|มุสลิม|อาหารอิสลาม|อิสลาม|อาหาร)', '', cleaned)
    cleaned = re.sub(r'[^a-z0-9ก-๙]', '', cleaned)
    thai_only = re.sub(r'[a-z]', '', cleaned)
    if len(thai_only) >= 3: return thai_only
    return cleaned if cleaned else raw

for idx, df in enumerate([df_g, df_o, df_w, df_r]):
    df['merge_key'] = df['restaurant_name'].apply(make_merge_key)
    df['merge_key'] = df.apply(lambda r: r['merge_key'] if r['merge_key'] != "" else f"unmatched_{idx}_{r.name}", axis=1)

df_g = df_g.rename(columns={'restaurant_name': 'name_g', 'rating': 'rating_g', 'category': 'category_g', 'district': 'district_g', 'opening_hours': 'opening_hours_g'})
df_o = df_o.rename(columns={'restaurant_name': 'name_o', 'category': 'category_o', 'cuisine': 'cuisine_o', 'opening_hours': 'opening_hours_o'})
df_w = df_w.rename(columns={'restaurant_name': 'name_w', 'rating': 'rating_w'})
df_r = df_r.rename(columns={'restaurant_name': 'name_r', 'category': 'category_r', 'district': 'district_r', 'location': 'location_r'})

for df in [df_g, df_o, df_w, df_r]:
    df.drop_duplicates(subset=['merge_key'], inplace=True)

df_merge = pd.merge(df_g, df_o, on='merge_key', how='outer')
df_merge = pd.merge(df_merge, df_w, on='merge_key', how='outer')
df_merge = pd.merge(df_merge, df_r, on='merge_key', how='outer')

df_merge['name'] = df_merge['name_g'].combine_first(df_merge['name_w']).combine_first(df_merge['name_r']).combine_first(df_merge['name_o'])
df_merge = df_merge.dropna(subset=['name']).drop_duplicates(subset=['name']).reset_index(drop=True)

# แปลงราคา (เฉพาะที่มีข้อมูลจริง)
def parse_pricing(row):
    raw_g = str(row.get('price_range', '')).strip() if pd.notna(row.get('price_range')) else ""
    raw_w = str(row.get('price', '')).strip() if pd.notna(row.get('price')) else ""
    if raw_g in ["nan", "None"]: raw_g = ""
    if raw_w in ["nan", "None"]: raw_w = ""
    raw_text = raw_g if raw_g else raw_w

    nums = [int(n) for n in re.findall(r'\d+', raw_text.replace(',', ''))]
    if len(nums) >= 2:
        min_p, max_p = nums[0], nums[1]
        if min_p == 1: min_p = 40
        if max_p <= 200: level = "฿"
        elif max_p <= 400: level = "฿฿"
        else: level = "฿฿฿"
        return pd.Series([level, min_p, max_p])

    if "฿" in raw_text:
        baht_count = raw_text.count("฿")
        if baht_count >= 3: return pd.Series(["฿฿฿", 251, 500])
        elif baht_count == 2: return pd.Series(["฿฿", 101, 250])
        else: return pd.Series(["฿", 40, 100])

    return pd.Series([None, None, None]) # ปล่อยว่างถ้าไม่มีข้อมูลจริง

def map_area_filter(row):
    combined = f"{row.get('name', '')} {row.get('district_g', '')} {row.get('district_r', '')} {row.get('location_r', '')} {row.get('url', '')}".lower()
    if any(kw in combined for kw in ["มฟล", "แม่ฟ้าหลวง", "mfu", "ท่าสุด", "หน้ามอ", "นางแล", "บ้านดู่"]) and "ดอยแม่สลอง" not in combined:
        return "รอบ มฟล."
    if any(kw in combined for kw in ["แม่สาย", "mae sai", "maesai", "ผาฮี้", "โป่งผา", "เวียงพางคำ"]):
        return "แม่สาย"
    if any(kw in combined for kw in ["เชียงแสน", "เชียงของ", "แม่สรวย", "พาน", "เวียงป่าเป้า", "พญาเม็งราย", "แม่จัน", "แม่สลอง"]):
        return "อำเภออื่นในเชียงราย"
    return "ตัวเมืองเชียงราย"

def map_cuisine_filter(row):
    combined = f"{row.get('name', '')} {row.get('category_r', '')} {row.get('category_g', '')} {row.get('cuisine_o', '')} {row.get('category_o', '')}".lower()
    if any(k in combined for k in ["กาแฟ", "คาเฟ่", "cafe", "coffee", "ชานม"]): return "ร้านกาแฟ"
    if any(k in combined for k in ["โรตี", "roti", "ชาชัก"]): return "โรตีและของหวาน"
    if any(k in combined for k in ["ของหวาน", "ขนม", "เบเกอรี่", "เค้ก", "บิงซู", "ไอติม"]): return "ของหวาน"
    if any(k in combined for k in ["อาหรับ", "เคบับ", "kebab", "ตุรกี", "อียิปต์"]): return "อาหารอาหรับ"
    if any(k in combined for k in ["อินเดีย", "indian", "นาน", "มาซาลา"]): return "อาหารอินเดีย"
    if any(k in combined for k in ["มาเลเซีย", "นาซิ", "มาเลย์"]): return "อาหารมาเลเซีย"
    if any(k in combined for k in ["ข้าวซอย", "น้ำเงี้ยว", "อาหารเหนือ", "ยูนนาน", "ไส้อั่ว", "ลาบ"]): return "อาหารท้องถิ่น"
    if any(k in combined for k in ["ตามสั่ง", "กะเพรา", "ผัดไทย", "ข้าวผัด", "ราดแกง"]): return "อาหารตามสั่ง"
    if any(k in combined for k in ["ไทย", "thai", "ส้มตำ", "ยำ", "ก๋วยเตี๋ยว", "ข้าวหมก", "ข้าวมันไก่", "ซุปหางวัว", "โจ๊ก"]): return "อาหารไทย"
    return "อาหารฮาลาล"

def extract_menu(row):
    text = f"{row.get('category_r', '')} {row.get('cuisine_o', '')} {row.get('name', '')}"
    kws = ["ข้าวซอย", "ข้าวหมกไก่", "ก๋วยเตี๋ยวเนื้อ", "โรตี", "ชาชัก", "ซุปหางวัว", "ส้มตำ", "หมาล่า", "ชาบู", "เนื้อย่าง", "พิซซ่า", "เบอร์เกอร์", "เคบับ", "สเต็ก", "ไก่ทอด", "อาหารตามสั่ง"]
    found = [kw for kw in kws if kw in text]
    return json.dumps(found, ensure_ascii=False)

def build_description(row):
    cat_r = str(row.get('category_r', '')).strip() if pd.notna(row.get('category_r')) else ""
    loc_r = str(row.get('location_r', '')).strip() if pd.notna(row.get('location_r')) else ""
    parts = []
    if cat_r and cat_r not in ["nan", "None"]: parts.append(cat_r)
    if loc_r and loc_r not in ["nan", "None"]: parts.append(f"พิกัด: {loc_r}")
    return " | ".join(parts) if parts else None

df_final = pd.DataFrame()
df_final['id'] = df_merge.index + 1
df_final['name'] = df_merge['name']
area_series = df_merge.apply(map_area_filter, axis=1)
df_final['district'] = area_series
df_final['zone'] = area_series
df_final['cuisine'] = df_merge.apply(map_cuisine_filter, axis=1)

pricing_df = df_merge.apply(parse_pricing, axis=1)
df_final['priceLevel'] = pricing_df[0]
df_final['minPrice'] = pd.to_numeric(pricing_df[1], errors='coerce').astype('Int64')
df_final['maxPrice'] = pd.to_numeric(pricing_df[2], errors='coerce').astype('Int64')

df_final['rating'] = df_merge['rating_g'].combine_first(df_merge['rating_w']).round(1)
df_final['halalStatus'] = "muslim-friendly"
df_final['description'] = df_merge.apply(build_description, axis=1)
df_final['menu'] = df_merge.apply(extract_menu, axis=1)

# ดึงเวลาเปิด-ปิดจาก Google Maps หรือ Overpass ที่เราสกัดมาได้
oh_col = 'opening_hours_g' if 'opening_hours_g' in df_merge.columns else None
df_final['openingHours'] = df_merge[oh_col] if oh_col else None

df_final['amenities'] = json.dumps(["Halal"], ensure_ascii=False)
df_final['latitude'] = df_merge['latitude']
df_final['longitude'] = df_merge['longitude']
df_final['verified'] = 0
df_final['image'] = df_merge.apply(lambda r: str(r.get('photo_url', '')) if pd.notna(r.get('photo_url')) and "maps/vt" not in str(r.get('photo_url')) else None, axis=1)
df_final['wongnai_url'] = df_merge['url'] # แนบ URL ไปให้ไฟล์ถัดไปขูดข้อมูล

non_cr = r"Chiang Mai|เชียงใหม่|Phayao|พะเยา|Bangkok|กรุงเทพ|Phetchabun|เพชรบูรณ์"
mask_valid = ~df_merge['district_g'].astype(str).str.contains(non_cr, case=False, na=False)
df_final = df_final[mask_valid].reset_index(drop=True)
df_final['id'] = df_final.index + 1

df_final.to_sql('merged_restaurants_json', conn, if_exists='replace', index=False)
print(f"รวมข้อมูลสำเร็จ จำนวน: {len(df_final)} ร้าน")
conn.close()