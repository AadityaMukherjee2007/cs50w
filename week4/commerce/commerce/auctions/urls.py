from os import name
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"), 
    path("new_listing", views.new_listing, name="new_listing"), 
    path("watchlist", views.watchlist, name="watchlist"), 
    path("addToWatchlist", views.addToWatchlist, name="addToWatchlist"),
    path("removeFromWatchlist", views.removeFromWatchlist, name="removeFromWatchlist"),
    path("closeAuction", views.closeAuction, name="closeAuction"),
    path("postComment", views.postComment, name="postComment"),
    path("deletePost", views.deletePost, name="deletePost"),
    path("placeBid", views.placeBid, name="placeBid"),
    path("category", views.category, name="category"),
    path("all", views.all, name="all"),
    path("includeInactive", views.includeInactive, name="includeInactive"),
    path("listing_page/<str:listing_id>", views.listingPage, name="listingPage")
]
