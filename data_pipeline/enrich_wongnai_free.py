import sqlite3
import time
import requests
import json
import re
from bs4 import BeautifulSoup
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
db_path = BASE_DIR / "halal.db"

def extract_wongnai_price(price_text):
    if not price_text: return None, None, None
    baht_count = price_text.count("฿")
    nums = [int(n) for n in re.findall(r'\d+', price_text.replace(',', ''))]
    min_p, max_p = (nums[0], nums[1]) if len(nums) >= 2 else (None, None)
    
    if baht_count >= 3: return "฿฿฿", min_p or 251, max_p or 500
    elif baht_count == 2: return "฿฿", min_p or 101, max_p or 250
    elif baht_count == 1: return "฿", min_p or 40, max_p or 100
    return None, None, None

def scrape_wongnai(url):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            scripts = soup.find_all('script', type='application/ld+json')
            for script in scripts:
                if not script.string: continue
                try:
                    data = json.loads(script.string)
                    # Wongnai เก็บข้อมูลร้านใน type Restaurant
                    if isinstance(data, dict) and data.get('@type') in ['Restaurant', 'LocalBusiness', 'FoodEstablishment']:
                        return data
                    elif isinstance(data, list):
                        for item in data:
                            if item.get('@type') in ['Restaurant', 'LocalBusiness', 'FoodEstablishment']:
                                return item
                except json.JSONDecodeError:
                    pass
    except Exception as e:
        print(f"Error scraping {url}: {e}")
    return None

def main():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # ดึงเฉพาะแถวที่มีลิงก์ Wongnai
    cursor.execute("SELECT id, name, wongnai_url FROM merged_restaurants_json WHERE wongnai_url IS NOT NULL")
    rows = cursor.fetchall()
    
    print(f"🚀 เริ่มดึงข้อมูลจริงจาก Wongnai จำนวน {len(rows)} ร้าน...\n")
    
    updated_count = 0
    for row_id, name, url in rows:
        data = scrape_wongnai(url)
        if data:
            price_text = data.get("priceRange")
            opening_hours = data.get("openingHours")
            geo = data.get("geo", {})
            
            p_level, min_p, max_p = extract_wongnai_price(price_text)
            open_hr = " | ".join(opening_hours) if isinstance(opening_hours, list) else str(opening_hours) if opening_hours else None
            lat, lon = geo.get("latitude"), geo.get("longitude")
            
            update_query = "UPDATE merged_restaurants_json SET verified = 1"
            params = []
            
            if p_level:
                update_query += ", priceLevel = ?, minPrice = ?, maxPrice = ?"
                params.extend([p_level, min_p, max_p])
            if open_hr:
                update_query += ", openingHours = ?"
                params.append(open_hr)
            if lat and lon:
                update_query += ", latitude = ?, longitude = ?"
                params.extend([lat, lon])
                
            update_query += " WHERE id = ?"
            params.append(row_id)
            
            cursor.execute(update_query, tuple(params))
            conn.commit()
            updated_count += 1
            print(f"  [✔] เจอข้อมูลจริง: {name[:25]:<25} | ราคา: {p_level}, เวลา: {str(open_hr)[:20]}")
        else:
            print(f"  [-] ไม่พบ JSON-LD : {name[:25]}")
            
        time.sleep(1.5) # หน่วงเวลากัน Wongnai บล็อก

    # ลบคอลัมน์ wongnai_url ออกก่อนส่งไปใช้งานจริงเพื่อความสะอาดของข้อมูล
    cursor.execute("ALTER TABLE merged_restaurants_json DROP COLUMN wongnai_url")
    conn.commit()
    conn.close()
    
    print("="*60)
    print(f"🎉 อัปเดตข้อมูลจริงจาก Wongnai สำเร็จ {updated_count} ร้าน!")

if __name__ == "__main__":
    main()