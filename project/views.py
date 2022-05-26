from django.core.paginator import Paginator
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from .models import Song, CustomUser
from .forms import RegisterForm
from django.db import IntegrityError
from .admin import UserCreationForm


def index(request):
    return render(request, "index.html")


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            try:
                user = form.save()
                user.save()

            except IntegrityError:
                return render(request, 'register.html')
            return HttpResponseRedirect('/')
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})