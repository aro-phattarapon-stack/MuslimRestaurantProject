import pandas as pd
from pathlib import Path
from db_utils import save_and_report

current_dir = Path(__file__).resolve().parent
data_dir = current_dir / "Data" / "google"
db_path = current_dir.parent / "halal.db"

df_list = []

selected_cols = [
    "OSrXXb",           # 0: ชื่อร้าน
    "rllt__details",    # 1: หมวดหมู่
    "yi40Hd",           # 2: เรตติ้ง
    "RDApEe",           # 3: จำนวนรีวิว
    "rllt__details 2",  # 4: ข้อมูลผสม 1
    "rllt__details 3",  # 5: ข้อมูลผสม 2
    "wA1Bge src"        # 11: ลิงก์รูปภาพ
]

new_names = ["restaurant_name", "category", "rating", "review_count", "col_a", "col_b", "photo_url"]

for file_path in data_dir.glob("*.csv"):
    df = pd.read_csv(file_path)
    clean_temp = df.reindex(columns=selected_cols).copy()
    clean_temp.columns = new_names
    df_list.append(clean_temp)

if not df_list:
    raise FileNotFoundError(f"ไม่พบไฟล์ CSV ใน: {data_dir}")

google_df = pd.concat(df_list, ignore_index=True)
google_df["category"] = google_df["category"].astype(str).str.replace(r"[·\s]", "", regex=True)
google_df["review_count"] = google_df["review_count"].astype(str).str.replace(r"[()]", "", regex=True)

# ฟังก์ชันแยก ราคา, พื้นที่ และ เวลาเปิด-ปิด
def extract_info(row):
    val_a = str(row["col_a"]).strip()
    val_b = str(row["col_b"]).strip()
    if val_a in ["nan", "None", ""]: val_a = ""
    if val_b in ["nan", "None", ""]: val_b = ""

    price, district, hours = None, None, None

    def is_price(text):
        return ("฿" in text) or (any(c.isdigit() for c in text) and ("-" in text or "–" in text) and len(text) < 15)
    def is_hours(text):
        return any(kw in text for kw in ["Open", "Closed", "Opens", "Closes", "24 hours", "AM", "PM"])
    def is_district(text):
        return any(kw in text for kw in ["District", "เชียงราย", "อำเภอ", "ตำบล", "Bangkok", "Mueang", "Mae", "Chiang", "Phan", "Wiang"])
    def is_review(text):
        return "Review" in text or "reviews" in text

    for val in [val_a, val_b]:
        if not val or is_review(val):
            continue
        if is_hours(val):
            hours = val.lstrip("· ").strip() # ลบจุดไข่ปลาข้างหน้าออก
        elif is_price(val):
            price = val
        elif is_district(val):
            district = val

    return pd.Series([price, district, hours])

google_df[["price_range", "district", "opening_hours"]] = google_df.apply(extract_info, axis=1)
google_df = google_df.drop(columns=["col_a", "col_b"])

non_chiangrai = r"Chiang Mai|เชียงใหม่|Phayao|พะเยา|Bangkok|กรุงเทพ|Phetchabun|เพชรบูรณ์"
google_df = google_df[~google_df["district"].astype(str).str.contains(non_chiangrai, case=False, na=False)]

exclude_pork = r"หมู|pork|หมูกระทะ|หมูกะทะ|กุนเชียง"
google_df = google_df[~google_df["restaurant_name"].astype(str).str.contains(exclude_pork, case=False, na=False)]
google_df = google_df.drop_duplicates(subset=["restaurant_name"])

save_and_report(google_df, "google_restaurants", "Google Maps", db_path)