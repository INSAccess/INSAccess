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
        return f"http://{settings.HOST_IP}:8000/"


@login_required
def finalize(request):
    user_profile, profile_created = UserProfile.objects.get_or_create(user=request.user)
    subscribed_tds = (
        request.session.get("attributes", {}).get("supannAffectation", []) or []
    )

    if profile_created or user_profile.cas_auto_sync:
        user_profile.save()

        normalized_cas_tds = [td.strip().lower() for td in subscribed_tds]

        tds_in_db = [
            td
            for td in GroupTD.objects.all()
            if td.name.strip().lower() in normalized_cas_tds
        ]

        user_profile.link_td.add(*tds_in_db)

    logger.info(f"User {request.user.id} logged in with TDs: {subscribed_tds}")
    return redirect(get_frontend_url())
