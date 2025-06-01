from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"), 
    path("new", views.new, name="new"),
    path("search", views.search_entry, name="searchEntry"),
    path("<str:title>", views.entry, name="entry"), 
    path("edit/<str:title>", views.edit, name="edit")
]