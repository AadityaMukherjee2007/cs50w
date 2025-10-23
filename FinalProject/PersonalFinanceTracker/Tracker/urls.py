from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("dashboard", views.dashboard, name="dashboard"),
    path("register", views.register, name="register"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("transactions", views.transactions, name="transactions"),
    path("addTransaction", views.addTransaction, name="addTransaction"),
    path("getTransactions", views.getTransactions, name="getTransactions"),
    path("getTransaction", views.getTransaction, name="getTransaction"),
    path("deleteTransaction", views.deleteTransaction, name="deleteTransaction"),
    path("editTransaction", views.editTransaction, name="editTransaction"),
    path("getGraphData", views.getGraphData, name="getGraphData"),
]
