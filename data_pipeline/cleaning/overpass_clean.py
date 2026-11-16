import json
import pandas as pd
from pathlib import Path
from db_utils import save_and_report

# 1. กำหนด Path
current_dir = Path(__file__).resolve().parent
json_path = current_dir / "chiangrai_restaurants.json"
db_path = current_dir.parent / "halal.db"

with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

elements = data.get("elements", [])
halal_restaurants = []
keywords = ["ฮาลาล", "มุสลิม", "อิสลาม", "halal"]

for item in elements:
    tags = item.get("tags", {})
    name = tags.get("name")
    if not name:
        continue

    cuisine = tags.get("cuisine", "").lower()
    diet_halal = tags.get("diet:halal", "").lower()
    name_lower = name.lower()

    is_tag_halal = ("halal" in cuisine) or (diet_halal == "yes")
    is_name_halal = any(kw in name_lower for kw in keywords)

    if is_tag_halal or is_name_halal:
        lat = item.get("lat") or (item.get("center", {}).get("lat") if item.get("center") else None)
        lon = item.get("lon") or (item.get("center", {}).get("lon") if item.get("center") else None)

halal_restaurants.append({
            "osm_id": item.get("id"),
            "restaurant_name": name,
            "category": tags.get("amenity"),
            "cuisine": tags.get("cuisine"),
            "diet_halal": tags.get("diet:halal"),
            "district": tags.get("addr:district") or tags.get("addr:city"),
            "opening_hours": tags.get("opening_hours"),
            "latitude": lat,
            "longitude": lon,
            "source": "overpass"
        })

halal_df = pd.DataFrame(halal_restaurants)
halal_df = halal_df.drop_duplicates(subset=["osm_id"])

print(f"พบร้านอาหารฮาลาลจาก Overpass ทั้งหมด: {len(halal_df)} ร้าน")
print(halal_df[["restaurant_name", "cuisine", "diet_halal", "latitude", "longitude"]])

# บันทึกและรายงานผลด้วยรูปแบบมาตรฐาน
save_and_report(halal_df, "overpass_restaurants", "OpenStreetMap (Overpass)", db_path)