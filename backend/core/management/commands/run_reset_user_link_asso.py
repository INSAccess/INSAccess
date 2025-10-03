from django.core.management.base import BaseCommand
from core.models import UserProfile, UserLinkAssociation, Association
import logging
import sys
import traceback

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Adds all the associations to the user's subscriptions. Intended to be run manually from the terminal."

    def handle(self, *args, **options):
        logger.info("run_reset_user_link_asso: starting user<->asso link reset")
        try:
            associations = Association.objects.all()
            users = UserProfile.objects.all()

            user_link_assos = [
                UserLinkAssociation(user=user, name_assos=asso)
                for user in users
                for asso in associations
            ]
            UserLinkAssociation.objects.bulk_create(user_link_assos)
            logger.info("run_reset_user_link_asso: link between users and associations updated successfully")
        except Exception as exc:
            logger.exception("run_reset_user_link_asso: link reset failed")
            self.stderr.write(self.style.ERROR("Link reset failed: %s" % exc))
            traceback.print_exc(file=sys.stderr)
            sys.exit(1)
