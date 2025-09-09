from core.utils.fetch_ics import CONFIG, fetch_department, filter_next_week
from core.utils.db_insertor import insert_list_record
import time
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def fetch_all_years() -> list:
    return [
        item
        for department in CONFIG["department_list"]
        for year in CONFIG["years_for_department"]
        for item in fetch_department(department, year)
    ] + [
        item
        for prepa in CONFIG["prepa_name"]
        for year in CONFIG["years_for_prepa"]
        for item in fetch_department(prepa, year)
    ]


def update_all_years():
    start_time = time.time()
    data = fetch_all_years()
    insert_list_record(data)
    elapsed_time = time.time() - start_time
    logger.info(f"update_all_years finished in {elapsed_time:.2f} seconds")


def update_next_week():
    start_time = time.time()
    data = fetch_all_years()
    insert_list_record(filter_next_week(data))
    elapsed_time = time.time() - start_time
    logger.info(f"update_next_month finished in {elapsed_time:.2f} seconds")
