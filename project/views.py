from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.core.paginator import Paginator
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse, reverse_lazy
from django.views.generic import FormView

from .models import Song, CustomUser
from .forms import SignInForm
from django.db import IntegrityError
from .admin import UserCreationForm


def index(request):
    test = Song.objects.first()
    songs = Song.objects.all()
    return render(request, "index.html", {"test": test, "songs": songs})


def music_data():
    pass


def ass(request):
    if request == "POST":
        form = SignInForm()
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(request, email=email, password=password)
            if user is not None:
                login(request, user)
                return HttpResponseRedirect(reverse("index"))
            else:
                return render(request, 'index.html', {
                    'message': "Invalid username and/or password"
                })
    else:
        form = SignInForm()
    return render(request, 'signin.html', {
            'form': form
        })


def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            try:
                user = form.save()
                user.save()

            except IntegrityError:
                return render(request, 'signup.html')
            return HttpResponseRedirect('/')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})


class SignInView(FormView):
    form_class = SignInForm
    success_url = reverse_lazy('index')
    template_name = 'signin.html'

    def form_valid(self, form):
        credentials = form.cleaned_data

        user = authenticate(username=credentials['email'], password=credentials['password'])

        if user is not None:
            login(self.request, user)
            return HttpResponseRedirect(self.success_url)

        else:
            messages.add_message(self.request, messages.INFO, 'Wrong email or password')
            return HttpResponseRedirect(reverse_lazy('signin'))


def music(request, genre):
    music_list = None
    if genre == 'all':
        music_list = Song.objects.all()
    music_list = music_list.order_by('title').all()
    return JsonResponse([song.serialize() for song in music_list], safe=False)