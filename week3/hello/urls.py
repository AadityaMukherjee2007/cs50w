from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"), 
    path("adi", views.adi, name="adi"), 
    path("<str:name>", views.greet, name="greet")
]