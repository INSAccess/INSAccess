from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth.models import User
from django.conf import settings
import logging
import sys
import traceback
import os

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Report some stat elements (runs report_stats once). Intended to be run from cron."

    def handle(self, *args, **options):
        logger.info("run_stats_report: starting stats report")
        try:
            nb_daily_users = User.objects.filter(last_login__startswith=timezone.now().date()).count()

            # Writing stats for telegraf

            data = [
                f"edt,item=daily value={nb_daily_users}i\n",
            ]

            with open(os.path.join(settings.BASE_DIR, 'users_telegraf.txt'), 'w') as f:
                f.writelines(data)
            logger.info("run_stats_report: stats report finished successfully")
        except Exception as exc:
            logger.exception("run_stats_report: stats report failed")
            self.stderr.write(self.style.ERROR("Stats report failed: %s" % exc))
            traceback.print_exc(file=sys.stderr)
            sys.exit(1)
