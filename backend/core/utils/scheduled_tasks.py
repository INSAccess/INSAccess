from core.utils.fetch_ics import CONFIG, fetch_department
from core.utils.db_insertor import insert_list_record
import time
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def update_all_years():
    start_time = time.time()
    data = []
    for department in CONFIG["department_list"]:
        for year in CONFIG["years_for_department"]:
            data += fetch_department(department, year)
    for prepa in CONFIG["prepa_name"]:
        for year in CONFIG["years_for_prepa"]:
            data += fetch_department(prepa, year)

    insert_list_record(data)
    elapsed_time = time.time() - start_time
    logger.info(f"update_all_years finished in {elapsed_time:.2f} seconds")
