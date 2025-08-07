from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from core.models import UserProfile, EnumColorTheme
from core.utils.fetch_ics import fetch_department
from core.utils.db_insertor import insert_list_record

from django_cas_ng.views import LoginView
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.urls import reverse

import logging

logger = logging.getLogger(__name__)

@require_http_methods(["GET"])
def cas_callback_debug(request):
    """Vue pour debugger les requetes CAS"""
    ticket = request.GET.get('ticket')
    error = request.GET.get('error')
    service = request.GET.get('service')

    debug_info = {
        'ticket': ticket,
        'error': error,
        'service': service,
        'user_authenticated': request.user.is_authenticated,
        'user': request.user.username if request.user.is_authenticated else None,
        'full_url': request.build_absolute_uri(),
        'get_params':dict(request.GET),
    }

    logger.info(f"Debug CAS Callback : {debug_info}")
    return JsonResponse(debug_info)

@login_required
def profile(request):
    return render(request, "profile.html", {"user": request.username})

@login_required
@require_http_methods(["POST"])
def user_logout(request):
    logout(request)
    return redirect("login")

def test_insertion(request):
    records = fetch_department("ITI" ,"3")
    insert_list_record(records)
    return render(request, "login.html")

# -------------------------------------------------------------- #

# Used before CAS integration, not needed now
def register(request):
    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        password2 = request.POST["password2"]

        # Check if passwords match
        if password != password2:
            messages.error(request, "Les mdp ne sont pas egaux!")
            return redirect("register")

        # Check if passwords are empty
        if not password or not password2:
            messages.error(request, "Le mot de passe ne peut pas être vide.")
            return redirect("register")

        # Check if username already exists
        if User.objects.filter(username=username).exists():
            messages.error(request, "Nom d'utilisateur déjà pris!")
            return redirect("register")

        # Create user and log them in
        user = User.objects.create_user(username=username, password=password)
        
        user_profile = UserProfile.objects.create(user = user,color_theme = EnumColorTheme.objects.filter(name="system").first())
        user_profile.save()
        user.save()
        login(request, user)
        return redirect("profile")

    return render(request, "register.html")

# Used before CAS integration, not needed now
def user_login(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]

        # Check if fields are empty
        if not username or not password:
            messages.error(request, "Tous les champs doivent être remplis!")
            return redirect("login")

        # Authenticate user
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("profile")
        else:   
            messages.error(request, "Mauvais mdp ou nom d'utilisateur")

    return render(request, "login.html")