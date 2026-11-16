import pandas as pd
from pathlib import Path
from db_utils import save_and_report

# 1. กำหนด Path
current_dir = Path(__file__).resolve().parent
data_dir = current_dir / "Data" / "wongnai"
db_path = current_dir.parent / "halal.db"

df_list = []

selected_cols = [
    "sc-1rqxbqo-0 href",
    "epawmp-0 src",
    "epawmp-0 src 2",
    "epawmp-0 src 3",
    "epawmp-0 src 4",
    "epawmp-0 src 5",
    "sc-1qge0b2-0",
    "Gap-sc-ilei7b",
    "sc-1uyabda-0",
    "rg12"
]

new_names = [
    "url", "food_photo1", "food_photo2", "food_photo3", "food_photo4",
    "food_photo5", "restaurant_name", "rating", "review", "price"
]

for file_path in data_dir.glob("*.csv"):
    df = pd.read_csv(file_path)

    clean_temp = df.reindex(columns=selected_cols).copy()
    clean_temp.columns = new_names

    df_list.append(clean_temp)

if not df_list:
    raise FileNotFoundError(f"ไม่พบไฟล์ CSV ใน: {data_dir}")

full_df = pd.concat(df_list, ignore_index=True)
print(f"รวมข้อมูลทั้งหมดได้: {len(full_df)} แถว")

# ลบแถวที่ url ซ้ำกัน ให้เหลือไว้แค่แถวแรกที่เจอ
full_df = full_df.drop_duplicates(subset=["url"])
print(f"หลังคัดร้านซ้ำออก เหลือข้อมูลจริง {len(full_df)} แถว")

# บันทึกและรายงานผลด้วยรูปแบบมาตรฐาน
save_and_report(full_df, "wongnai_restaurants", "Wongnai", db_path)