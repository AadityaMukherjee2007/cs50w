
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile", views.profile, name="profile"),
    path("getposts", views.getPosts, name="getposts"),
    path("getpost", views.getPost, name="getpost"),
    path("likepost", views.likePost, name="likepost"),
    path("unlikepost", views.unlikePost, name="unlikepost"),
    path("likedpostcheck", views.likedpostcheck, name="likedpostcheck"),
    path("goToProfile", views.goToProfile, name="goToProfile"),
]