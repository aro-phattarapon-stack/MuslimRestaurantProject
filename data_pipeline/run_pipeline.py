import subprocess
import sys
import time
from pathlib import Path

# 1. กำหนดโฟลเดอร์หลักของโปรเจกต์
BASE_DIR = Path(__file__).resolve().parent

# 2. เรียงลำดับขั้นตอนการทำงานของ Pipeline (จากต้นน้ำ ไปปลายน้ำ)
PIPELINE_STEPS = [
    BASE_DIR / "getData.py",                          # 1. ดึงข้อมูลดิบ
    BASE_DIR / "cleaning" / "google_map_clean.py",    # 2. คลีน Google Maps
    BASE_DIR / "cleaning" / "overpass_clean.py",      # 3. คลีน OpenStreetMap
    BASE_DIR / "cleaning" / "research_clean.py",      # 4. คลีนข้อมูลวิจัย (CSV)
    BASE_DIR / "cleaning" / "wongnai_clean.py",       # 5. คลีน Wongnai
    BASE_DIR / "merge_halal_data.py",                 # 6. รวมข้อมูลเข้าตารางหลัก
    BASE_DIR / "enrich_wongnai_free.py",              # 7. ดึงข้อมูลจริงจากเว็บ Wongnai (ราคา, เวลา, พิกัด)
    BASE_DIR / "enrich_coordinates.py",               # 8. เติมพิกัดและชื่ออำเภอที่ยังขาดหาย (Geocoding)
    BASE_DIR / "export_to_json.py"                    # 9. ส่งออกเป็น JSON ให้แอปใช้งาน
]

def run_pipeline():
    start_time = time.time()
    print("======================================================")
    print("       🚀 เริ่มต้นการทำงาน Halal Data Pipeline        ")
    print("======================================================\n")

    for step_path in PIPELINE_STEPS:
        # เช็คว่ามีไฟล์นี้อยู่จริงไหมก่อนรัน
        if not step_path.exists():
            print(f"[WARNING] ไม่พบไฟล์ {step_path.name} ข้ามขั้นตอนนี้ไป...")
            continue

        relative_name = step_path.relative_to(BASE_DIR)
        print(f"▶ กำลังรันขั้นตอน: {relative_name} ...")
        
        # รันไฟล์ Python ด้วย Environment ปัจจุบัน (sys.executable)
        result = subprocess.run([sys.executable, str(step_path)], cwd=BASE_DIR)
        
        if result.returncode != 0:
            print(f"\n❌ [CRITICAL ERROR] ขั้นตอน {relative_name} ล้มเหลว! หยุดการทำงานทันที")
            sys.exit(1)
            
        print(f"✔ [SUCCESS] {relative_name} เสร็จสมบูรณ์\n" + "-"*54)

    elapsed = round(time.time() - start_time, 2)
    print("======================================================")
    print(f"🎉 Pipeline ทำงานเสร็จสิ้นทั้งหมดในเวลา {elapsed} วินาที!")
    print("======================================================")

if __name__ == "__main__":
    run_pipeline()