from core.utils.fetch_ics import CONFIG, fetch_department, filter_next_week
from core.utils.db_insertor import insert_list_record, write_stats
from django.contrib.sessions.models import Session
from django.utils import timezone
from django.contrib.auth.models import User
import time
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def get_current_active_users():
    active_sessions = Session.objects.filter(expire_date__gte=timezone.now())
    nb_users = 0
    for session in active_sessions:
        data = session.get_decoded()
        user_id = data.get("_auth_user_id", None)
        if user_id:
            nb_users += 1
    return nb_users


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
        logger.info(f"No TDs found for the following events: {sorted(merged_no_tds)}")

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


def report_stats():
    nb_active_users = get_current_active_users()
    nb_daily_users = User.objects.filter(
        last_login__startswith=timezone.now().date()
    ).count()

    write_stats(nb_active_users=nb_active_users, nb_daily_users=nb_daily_users)
