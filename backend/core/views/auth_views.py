from django.shortcuts import redirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from core.models import UserProfile, EnumColorTheme
from core.utils.fetch_ics import fetch_department
from core.utils.db_insertor import insert_list_record

from django_cas_ng.views import LoginView
import logging

logger = logging.getLogger(__name__)

@login_required
def finalize(request):
    user, user_created = User.objects.get_or_create(username=request.user)

    # create user profile if it doesn't exists
    user_profile, profile_created = UserProfile.objects.get_or_create(user = user)
    user_profile.save()

    return redirect("http://localhost:3000/")

def test_insertion(request):
    records = fetch_department("ITI" ,"4")
    insert_list_record(records)
    return redirect("http://localhost:3000/")

def seed_database(request):
    from core.fixtures.seed_enums import run_seeder
    run_seeder()
    return redirect(request, "login.html")
