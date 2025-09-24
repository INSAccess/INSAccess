from django.core.management.base import BaseCommand
from core.utils.scheduled_tasks import report_stats
import logging
import sys
import traceback

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Report some stat elements (runs report_stats once). Intended to be run from cron."

    def handle(self, *args, **options):
        logger.info("run_stats_report: starting stats report")
        try:
            report_stats()
            logger.info("run_stats_report: stats report finished successfully")
        except Exception as exc:
            logger.exception("run_stats_report: stats report failed")
            self.stderr.write(self.style.ERROR("Stats report failed: %s" % exc))
            traceback.print_exc(file=sys.stderr)
            sys.exit(1)
