from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from core.models import UserProfile, GroupTD
from django.conf import settings

import logging

logger = logging.getLogger(__name__)


def get_frontend_url():
    """
    Returns the frontend URL depending on the environment.
    Dev: localhost:3000
    Prod: <your-ip>:80
    """
    if not settings.DEBUG:
        return f"http://{settings.HOST_IP}"
    else:
        return f"http://{settings.HOST_IP}:3000/"


@login_required
def finalize(request):
    user_profile, profile_created = UserProfile.objects.get_or_create(user=request.user)
    subscribed_tds = request.session.get("attributes", {}).get("supannAffectation", [])
    subscribed_tds = [td.upper() for td in subscribed_tds]
    if profile_created or user_profile.cas_auto_sync:
        user_profile.save()
        tds_in_db = GroupTD.objects.filter(name__in=subscribed_tds)
        user_profile.link_td.add(*tds_in_db)
    logger.info(f"User logged in with {subscribed_tds} as his td_groups")
    return redirect(get_frontend_url())
