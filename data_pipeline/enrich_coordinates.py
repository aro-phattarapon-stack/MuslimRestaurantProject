import sqlite3
import time
import re
import random
from pathlib import Path
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

# 1. กำหนด Path ของฐานข้อมูลด้วย pathlib ให้ชี้ไปที่โฟลเดอร์ data_pipeline เสมอ
BASE_DIR = Path(__file__).resolve().parent
db_path = BASE_DIR / "halal.db"

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# ตั้งชื่อ user_agent ให้ชัดเจนตามกฎของ OpenStreetMap Nominatim
geolocator = Nominatim(user_agent="chiangrai_halal_enrichment_v3")

# 2. พิกัดจุดศูนย์กลางของแต่ละอำเภอในเชียงราย (ใช้เป็นตัวสำรองขั้นสุดท้าย)
DISTRICT_COORDS = {
    "mueang": (19.9105, 99.8406),        # อ.เมืองเชียงราย
    "muang": (19.9105, 99.8406),
    "เมือง": (19.9105, 99.8406),
    "mae sai": (20.4335, 99.8833),       # อ.แม่สาย
    "maesai": (20.4335, 99.8833),
    "แม่สาย": (20.4335, 99.8833),
    "mae fa luang": (20.1567, 99.8631),  # อ.แม่ฟ้าหลวง / ดอยแม่สลอง
    "แม่ฟ้าหลวง": (20.1567, 99.8631),
    "แม่สลอง": (20.1567, 99.8631),
    "chiang saen": (20.2750, 100.0869),  # อ.เชียงแสน
    "เชียงแสน": (20.2750, 100.0869),
    "chiang khong": (20.2614, 100.4047), # อ.เชียงของ
    "เชียงของ": (20.2614, 100.4047),
    "mae suai": (19.6544, 99.5414),      # อ.แม่สรวย
    "แม่สรวย": (19.6544, 99.5414),
    "phan": (19.5517, 99.7406),          # อ.พาน
    "พาน": (19.5517, 99.7406),
    "wiang pa pao": (19.3492, 99.5067),  # อ.เวียงป่าเป้า
    "เวียงป่าเป้า": (19.3492, 99.5067),
    "phaya mengrai": (19.8475, 100.1519),# อ.พญาเม็งราย
    "พญาเม็งราย": (19.8475, 100.1519),
    "mae chan": (20.1467, 99.8525),      # อ.แม่จัน
    "แม่จัน": (20.1467, 99.8525),
    "default": (19.9071, 99.8325)        # จุดกลางตัวเมืองเชียงราย (หอนาฬิกา)
}

# ตารางคำสำคัญสำหรับสกัดชื่ออำเภอให้เป็นรูปแบบมาตรฐานเดียวกัน
DISTRICT_MAPPING = [
    (["แม่สาย", "mae sai", "maesai", "ผาฮี้", "โป่งผา", "เวียงพางคำ"], "อ.แม่สาย"),
    (["แม่ฟ้าหลวง", "mae fa luang", "แม่สลอง", "เทอดไท"], "อ.แม่ฟ้าหลวง"),
    (["เชียงแสน", "chiang saen", "เวียงเชียงแสน"], "อ.เชียงแสน"),
    (["เชียงของ", "chiang khong"], "อ.เชียงของ"),
    (["แม่สรวย", "mae suai", "ดอยช้าง", "วาวี"], "อ.แม่สรวย"),
    (["พาน", "phan", "เมืองพาน"], "อ.พาน"),
    (["เวียงป่าเป้า", "wiang pa pao", "แม่ขะจาน"], "อ.เวียงป่าเป้า"),
    (["พญาเม็งราย", "phaya mengrai"], "อ.พญาเม็งราย"),
    (["แม่จัน", "mae chan"], "อ.แม่จัน"),
    (["เมือง", "mueang", "muang", "รอบเวียง", "บ้านดู่", "นางแล", "ริมกก", "แม่กรณ์", "ท่าสุด", "มฟล", "mfu", "กาดหลวง"], "อ.เมืองเชียงราย"),
]

def is_in_chiangrai(lat, lon):
    """ตรวจสอบว่าพิกัดอยู่ในกรอบจังหวัดเชียงรายจริงหรือไม่"""
    if lat is None or lon is None:
        return False
    return (19.00 <= float(lat) <= 20.50) and (99.30 <= float(lon) <= 100.60)

def clean_restaurant_name(name):
    """ตัดคำขยายและสัญลักษณ์ออกเพื่อให้ค้นหาใน Nominatim เจอง่ายขึ้น"""
    if not name:
        return ""
    name = re.sub(r"\(.*?\)", "", str(name))
    name = re.split(r"[&\-|/]", name)[0]
    noise_words = ["ฮาลาล", "halal", "อาหารอิสลาม", "อาหารมุสลิม", "ร้านอาหาร", "ร้าน", "สาขา"]
    for word in noise_words:
        name = re.sub(word, "", name, flags=re.IGNORECASE)
    return name.strip()

def extract_standard_district(*texts):
    """สกัดชื่ออำเภอมาตรฐานจากข้อความที่อยู่ของ API, ชื่อร้าน หรือข้อมูลเดิม"""
    combined = " ".join([str(t) for t in texts if t and str(t).lower() not in ["none", "null", "nan"]]).lower()
    if not combined.strip():
        return None
        
    for keywords, standard_name in DISTRICT_MAPPING:
        if any(kw in combined for kw in keywords):
            return standard_name
    return None

def get_fallback_coords(district_text, name_text, zone_text=""):
    """หาพิกัดสำรองตามระดับโซนหรืออำเภอ พร้อมใส่ Jitter กันหมุดซ้อนทับกัน"""
    combined_text = f"{district_text or ''} {name_text or ''} {zone_text or ''}".lower()
    
    # เช็คกรณีพิเศษโซนหน้า มฟล. (ต.ท่าสุด อ.เมืองเชียงราย)
    if any(k in combined_text for k in ["มฟล", "มหาวิทยาลัยแม่ฟ้าหลวง", "mfu", "ท่าสุด", "หน้ามอ"]):
        base_lat, base_lon = (20.0450, 99.8940)
    elif any(k in combined_text for k in ["บ้านดู่", "baan du", "ราชภัฏ"]):
        base_lat, base_lon = (19.9845, 99.8620)
    else:
        base_lat, base_lon = DISTRICT_COORDS["default"]
        for key, coords in DISTRICT_COORDS.items():
            if key in combined_text:
                base_lat, base_lon = coords
                break
                
    jitter_lat = random.uniform(-0.002, 0.002)
    jitter_lon = random.uniform(-0.002, 0.002)
    return round(base_lat + jitter_lat, 6), round(base_lon + jitter_lon, 6)

# 3. ดึงรายการที่ยังไม่มีพิกัด หรือ ยังไม่มีข้อมูลอำเภอ (district)
cursor.execute("""
    SELECT id, name, district, zone, latitude, longitude 
    FROM merged_restaurants_json 
    WHERE latitude IS NULL 
       OR longitude IS NULL 
       OR district IS NULL 
       OR TRIM(district) = ''
""")
rows = cursor.fetchall()

print(f"พบข้อมูลที่ต้องตรวจสอบพิกัด/อำเภอ ทั้งหมด {len(rows)} ร้าน...\n")

exact_match_count = 0
reverse_match_count = 0
fallback_count = 0

for row_id, name, district, zone, current_lat, current_lon in rows:
    short_name = clean_restaurant_name(name)
    lat, lon = current_lat, current_lon
    clean_dist = extract_standard_district(district, zone, name)
    method = ""

    # --- กรณีที่ 1: มีพิกัดอยู่แล้ว (เช่น มาจาก Overpass) แต่ยังไม่มีชื่ออำเภอ ---
    if is_in_chiangrai(lat, lon) and not clean_dist:
        try:
            location = geolocator.reverse((lat, lon), timeout=10, language="th")
            if location and location.address:
                clean_dist = extract_standard_district(location.address, name)
                method = "REVERSE_GEOCODE"
                reverse_match_count += 1
        except GeocoderTimedOut:
            print(f"[Timeout Reverse] {name}")
        except Exception:
            pass
        time.sleep(1.1)

    # --- กรณีที่ 2: ยังไม่มีพิกัด (หรือพิกัดเดิมอยู่นอกเชียงราย) ให้ค้นหาจากชื่อร้าน ---
    if not is_in_chiangrai(lat, lon):
        lat, lon = None, None
        if len(short_name) >= 3:
            try:
                query = f"{short_name}, Chiang Rai, Thailand"
                location = geolocator.geocode(query, timeout=10, language="th")
                
                if location and is_in_chiangrai(location.latitude, location.longitude):
                    lat = round(location.latitude, 6)
                    lon = round(location.longitude, 6)
                    # ถ้ายังไม่มีชื่ออำเภอ ให้ดึงจากที่อยู่ที่ API ส่งกลับมาด้วยเลย
                    if not clean_dist and location.address:
                        clean_dist = extract_standard_district(location.address, district, name)
                    method = "API_EXACT"
                    exact_match_count += 1
            except GeocoderTimedOut:
                print(f"[Timeout Geocode] {name}")
            except Exception:
                pass
            time.sleep(1.1) # หน่วงเวลาตามกฎของ Nominatim (ห้ามเกิน 1 ครั้ง/วินาที)

    # --- กรณีที่ 3: ถ้า API หาพิกัดไม่เจอ ให้ใช้พิกัดระดับอำเภอ/โซน (Fallback) ---
    if lat is None or lon is None:
        lat, lon = get_fallback_coords(clean_dist or district, name, zone)
        method = "DISTRICT_FALLBACK"
        fallback_count += 1

    # ถ้าสกัดชื่ออำเภอจากทุกทางแล้วยังไม่ได้จริงๆ แต่มีค่า district เดิมติดมา ให้ใช้ค่าเดิมไปก่อน
    final_district = clean_dist or district or "อ.เมืองเชียงราย (ประมาณการ)"

    # --- บันทึกผลลัพธ์กลับลงฐานข้อมูล ---
    cursor.execute("""
        UPDATE merged_restaurants_json 
        SET latitude = ?, 
            longitude = ?
        WHERE id = ?
    """, (lat, lon, row_id))
    conn.commit()
    
    print(f"[{method or 'UPDATED':<17}] {str(name)[:28]:<28} -> ({lat:.6f}, {lon:.6f}) | {final_district}")

conn.close()
print("\n" + "="*60)
print(f"สรุปผลการประมวลผลทั้งหมด {len(rows)} ร้าน:")
print(f"- พบพิกัดจริงจากชื่อร้าน (API Geocode)     : {exact_match_count} ร้าน")
print(f"- ดึงชื่ออำเภอจากพิกัดเดิม (Reverse Geocode): {reverse_match_count} ร้าน")
print(f"- เติมพิกัดประมาณการตามโซน/อำเภอ (Fallback): {fallback_count} ร้าน")
print("="*60)