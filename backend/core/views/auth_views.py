from django.shortcuts import redirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from core.models import UserProfile
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

    # create user profile if it doesn't exists
    user_profile, profile_created = UserProfile.objects.get_or_create(user = user)
    user_profile.save()

    return redirect(get_frontend_url())

