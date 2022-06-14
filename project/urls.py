from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('signup', views.signup, name='signup'),
    path('signin', views.SignInView.as_view(), name='signin'),
    path('musiclist/<str:genre>', views.music, name='music_list'),
    path('playlist/<int:song_id>', views.playlist_view, name='playlist'),
]
