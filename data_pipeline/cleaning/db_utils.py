import sqlite3
import pandas as pd
from pathlib import Path

def save_and_report(df: pd.DataFrame, table_name: str, source_label: str, db_path: Path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. เช็คจำนวนแถวเดิมในตาราง (ถ้ายังไม่มีตารางนี้ ให้ถือว่าเป็น 0)
    try:
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        old_count = cursor.fetchone()[0]
    except sqlite3.OperationalError:
        old_count = 0

    # 2. บันทึกข้อมูลชุดใหม่ทับลงไป
    df.to_sql(table_name, conn, if_exists="replace", index=False)
    conn.close()
    
    # 3. คำนวณส่วนต่างและแสดงผลในรูปแบบมาตรฐานเดียวกัน
    new_count = len(df)
    diff = new_count - old_count
    
    if diff > 0:
        status_text = f"เพิ่มขึ้น +{diff} รายการ"
    elif diff < 0:
        status_text = f"ลดลง {diff} รายการ"
    else:
        status_text = "ไม่มีการเปลี่ยนแปลง (0 รายการ)"

    print("=" * 55)
    print(f"[แหล่งข้อมูล: {source_label}] -> ตาราง: {table_name}")
    print(f"- จำนวนข้อมูลเดิมในระบบ : {old_count} รายการ")
    print(f"- จำนวนข้อมูลใหม่หลังคลีน : {new_count} รายการ")
    print(f"- สถานะการบันทึก        : บันทึกเสร็จสิ้น ({status_text})")
    print("=" * 55 + "\n")