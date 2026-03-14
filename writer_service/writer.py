import csv
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parents[1] / "backend" / "data" / "data.csv"

def append_expense(title: str, category: str):
    file_exists = DATA_FILE.exists()

    try:
        with open(DATA_FILE, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)

            if not file_exists or DATA_FILE.stat().st_size == 0:
                writer.writerow(["title", "category"])

            writer.writerow([title, category])

        return True

    except Exception as e:
        print(f"Error writing expense: {e}")
        return False