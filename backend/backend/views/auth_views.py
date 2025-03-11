from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from backend.models import UserProfile

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
        user.save()
        user_profile = UserProfile.objects.create(user = user)
        user_profile.save()
        login(request, user)
        return redirect("profile")

    return render(request, "register.html")


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


def user_logout(request):
    logout(request)
    return redirect("login")


@login_required
def profile(request):
    return render(request, "profile.html", {"user": request.user})
