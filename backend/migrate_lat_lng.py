import sqlite3
import os

db_path = r"d:\STARTUP\aeriva\backend\anoku.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        print("Adding latitude/longitude columns to 'bookings' table...")
        
        cursor.execute("PRAGMA table_info(bookings)")
        existing_cols = [col[1] for col in cursor.fetchall()]
        
        cols_to_add = [
            ("latitude", "FLOAT"),
            ("longitude", "FLOAT")
        ]
        
        for col_name, col_type in cols_to_add:
            if col_name not in existing_cols:
                print(f"Adding {col_name}...")
                cursor.execute(f"ALTER TABLE bookings ADD COLUMN {col_name} {col_type}")
            else:
                print(f"Column {col_name} already exists.")
                
        conn.commit()
        print("Migration completed successfully.")
    except Exception as e:
        print(f"Error during migration: {e}")
    finally:
        conn.close()
else:
    print(f"DB not found at {db_path}")
