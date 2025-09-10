from django.shortcuts import redirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from core.models import UserProfile, GroupTD
from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver

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
    user_profile.save()

    if profile_created:
        subscribed_tds = request.session.get("attributes", {}).get(
            "supannAffectation", []
        )
        subscribed_tds = [td.upper() for td in subscribed_tds]

        tds_in_db = GroupTD.objects.filter(name__in=subscribed_tds)
        user_profile.link_td.add(*tds_in_db)

    return redirect(get_frontend_url())

@receiver(user_logged_in)
def normalize_username_on_login(sender, user, request, **kwargs):
    original_username = user.username
    normalized_username = original_username.lower()
    
    if original_username != normalized_username:
        try:
            existing_user = User.objects.get(username=normalized_username)
            if existing_user.id != user.id:
                merge_user_data(user, existing_user)
                user.delete()
                request.user = existing_user
        except User.DoesNotExist:
            user.username = normalized_username
            user.save()

def merge_user_data(from_user, to_user):
    try:
        from_profile = UserProfile.objects.get(user=from_user)
        to_profile, created = UserProfile.objects.get_or_create(user=to_user)
        
        if created or not to_profile.link_td.exists():
            to_profile.link_td.set(from_profile.link_td.all())
            to_profile.save()
        
        from_profile.delete()
    except UserProfile.DoesNotExist:
        pass