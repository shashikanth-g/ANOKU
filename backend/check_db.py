import sqlite3
import os

db_path = r"d:\STARTUP\aeriva\backend\anoku.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("PRAGMA table_info(bookings)")
        columns = cursor.fetchall()
        print("Columns in 'bookings' table:")
        for col in columns:
            print(col)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()
else:
    print(f"DB not found at {db_path}")
