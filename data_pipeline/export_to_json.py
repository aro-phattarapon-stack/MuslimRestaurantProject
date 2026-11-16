import sqlite3
import pandas as pd
import numpy as np
import json
from pathlib import Path

# 1. กำหนด Path
current_dir = Path(__file__).resolve().parent
db_path = current_dir / "halal.db"

# สร้างโฟลเดอร์ results หากยังไม่มี และกำหนดพาธไฟล์ restaurants.js
results_dir = current_dir / "results"
results_dir.mkdir(parents=True, exist_ok=True)
js_output_path = results_dir / "restaurants.js"

# 2. เชื่อมต่อฐานข้อมูลและดึงข้อมูล
conn = sqlite3.connect(db_path)
df = pd.read_sql("SELECT * FROM merged_restaurants_json", conn)
conn.close()

# 3. จัดการค่าว่าง (Missing Values) แบบเด็ดขาด
df = df.astype(object)
df = df.replace({np.nan: None})

# 4. แปลง DataFrame ให้เป็นรูปแบบ (Schema) ตามที่ต้องการ
formatted_records = []
for _, row in df.iterrows():
    record = {
        "id": row.get("id"),
        "name": row.get("name"),
        "cuisine": row.get("cuisine"),
        "rating": row.get("rating"),
        "reviews": None,
        "area": row.get("zone") if row.get("zone") else row.get("district"),
        "district": row.get("district"),
        "province": "Chiang Rai",
        "priceRange": row.get("priceLevel"),
        "openingNote": row.get("openingHours"),
        "latitude": row.get("latitude"),
        "longitude": row.get("longitude"),
        "halalStatus": row.get("halalStatus", "muslim-friendly"),
        # ถ้า verified = 1 (ข้อมูลจริง) แปลว่าไม่ต้องเช็คแล้ว (False) แต่ถ้า 0 คือ True
        "needsHalalCheck": False if row.get("verified") == 1 else True,
        "otherProvince": False
    }
    formatted_records.append(record)

# 5. บันทึกเป็นไฟล์ JavaScript (.js)
# แปลงเป็น JSON String (Pretty Print)
json_data = json.dumps(formatted_records, ensure_ascii=False, indent=2)

# หุ้มด้วยตัวแปร JavaScript (ES6 Module)
js_content = f"export const restaurants = {json_data};\n"

with open(js_output_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"ส่งออกไฟล์ JS สำเร็จ! บันทึกไว้ที่: {js_output_path}")