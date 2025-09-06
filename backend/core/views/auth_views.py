from django.shortcuts import redirect
from django.contrib.auth.models import User
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
    user, user_created = User.objects.get_or_create(username=request.user)
    logger.info(request.user.username)
    user_profile, profile_created = UserProfile.objects.get_or_create(user = user)
    user_profile.save()
    if profile_created :
        subscribed_tds = request.session.get('attributes', {}).get('supannAffectation', [])
        subscribed_tds = [td.upper() for td in subscribed_tds]

        tds_in_db = GroupTD.objects.filter(name__in=subscribed_tds)
        user_profile.link_td.add(*tds_in_db)

    return redirect(get_frontend_url())

