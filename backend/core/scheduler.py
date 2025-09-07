from apscheduler.schedulers.background import BackgroundScheduler
from core.utils.scheduled_tasks import update_all_years
import logging
import atexit

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler(timezone="UTC")


def start():
    if not scheduler.running:
        scheduler.add_job(
            update_all_years,
            "interval",
            minutes=15,
            id="my_hourly_task",
            replace_existing=True,
        )
        scheduler.start()
        print("APScheduler started (every minute)")

        atexit.register(lambda: scheduler.shutdown(wait=False))
