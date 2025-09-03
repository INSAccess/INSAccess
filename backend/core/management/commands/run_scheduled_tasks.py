from django.core.management.base import BaseCommand
from core.utils.scheduled_tasks import update_all_years
import logging
import sys
import traceback

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = "Run scheduled tasks (runs update_all_years once). Intended to be run from cron."

    def handle(self, *args, **options):
        logger.info("run_scheduled_tasks: starting update_all_years")
        try:
            update_all_years()
            logger.info("run_scheduled_tasks: update_all_years finished successfully")
        except Exception as exc:
            # Log stacktrace to both logger and stderr so cron logs it
            logger.exception("run_scheduled_tasks: update_all_years failed")
            self.stderr.write(self.style.ERROR("Scheduled task failed: %s" % exc))
            traceback.print_exc(file=sys.stderr)
            # non-zero exit so cron/systemd knows something went wrong
            sys.exit(1)
