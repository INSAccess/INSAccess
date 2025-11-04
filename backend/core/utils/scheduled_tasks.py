from core.utils.fetch_ics import CONFIG, fetch_department, filter_next_week
from core.utils.db_insertor import insert_list_record

import time
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def fetch_all_years() -> list:
    all_events = []
    merged_no_tds = set()

    for department in CONFIG["department_list"]:
        for year in CONFIG["years_for_department"]:
            events, no_tds_events = fetch_department(department, year)
            all_events.extend(events)
            merged_no_tds.update(no_tds_events)

    for prepa in CONFIG["prepa_name"]:
        for year in CONFIG["years_for_prepa"]:
            events, no_tds_events = fetch_department(prepa, year)
            all_events.extend(events)
            merged_no_tds.update(no_tds_events)

    # Log once at the end
    if merged_no_tds:
        logger.info(f"No TD group found for the following events (a tag was automatically attributed): {sorted(merged_no_tds)}")

    return all_events


def update_all_years():
    start_time = time.time()
    data = fetch_all_years()
    insert_list_record(data)
    elapsed_time = time.time() - start_time
    logger.info(f"update_all_years finished in {elapsed_time:.2f} seconds")


def update_next_week():
    start_time = time.time()
    data = fetch_all_years()
    next_week = filter_next_week(data)
    insert_list_record(next_week)
    elapsed_time = time.time() - start_time
    logger.info(f"update_next_week finished in {elapsed_time:.2f} seconds")
