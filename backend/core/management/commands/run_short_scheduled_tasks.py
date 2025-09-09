from django.core.management.base import BaseCommand
from core.utils.scheduled_tasks import update_next_week
import logging
import sys
import traceback

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Run scheduled tasks (runs update_next_week once). Intended to be run from cron."

    def handle(self, *args, **options):
        logger.info("run_scheduled_tasks: starting update_next_week")
        try:
            update_next_week()
            logger.info("run_scheduled_tasks: update_next_week finished successfully")
        except Exception as exc:
            logger.exception("run_scheduled_tasks: update_next_week failed")
            self.stderr.write(self.style.ERROR("Scheduled task failed: %s" % exc))
            traceback.print_exc(file=sys.stderr)
            sys.exit(1)
