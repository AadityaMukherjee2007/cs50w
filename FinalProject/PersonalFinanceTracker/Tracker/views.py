from django.core.paginator import Paginator
from django.db.models import Sum, Q
import json
from django import forms
from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from .models import Transaction, Category, User

# Create your views here.

class TransactionForm(forms.Form):
    amount = forms.DecimalField()
    description = forms.CharField(max_length=1000)
    category = forms.CharField(max_length=64)
    date = forms.DateField()


def index(request):
    print(request.user)
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("login"))
    else:
        return HttpResponseRedirect(reverse("dashboard"))
    
    
def addTransaction(request):
    user = request.user
    if request.method == "POST":
        data = json.loads(request.body)
        form = TransactionForm(data)
        if form.is_valid():
            amt = form.cleaned_data["amount"]
            description = form.cleaned_data["description"]
            category_name = form.cleaned_data["category"]
            date = form.cleaned_data["date"]

            category, _= Category.objects.get_or_create(name=category_name)

            transaction = Transaction()
            transaction.user = user 
            transaction.amount = amt 
            transaction.description = description
            transaction.category = category
            transaction.datetime = date
            transaction.save()

            # print(user, amt, description, category, date)
            return JsonResponse({
                "amount": amt,
                "description": description,
                "category": category.name,
                "date": date
            })
    return JsonResponse({
        "error": "Invalid Request"
    }, status=404)



def getTransactions(request):
    if request.method == "GET":
        username = request.user
        amt = request.GET.get("amt")
        amt_choice = request.GET.get("amtchoice")
        desc = request.GET.get("desc")
        cat = request.GET.get("cat")
        date = request.GET.get("date")
        page_number = request.GET.get("page", 1)  
        per_page = request.GET.get("per_page", 5) 

        filters = Q(user__username=username)

        if amt:
            if amt_choice == "=":
                filters &= Q(amount=amt)
            elif amt_choice == "<=":
                filters &= Q(amount__lte=amt)
            elif amt_choice == ">=":
                filters &= Q(amount__gte=amt)

        if desc:
            filters &= Q(description__icontains=desc)

        if cat:
            filters &= Q(category__name__icontains=cat)

        if date:
            filters &= Q(datetime__date=date)

        transactions = Transaction.objects.filter(filters).order_by("-datetime")
        paginator = Paginator(transactions, per_page)

        try:
            page_obj = paginator.page(page_number)
        except:
            page_obj = paginator.page(1)

        data = list(page_obj.object_list.values("id", "amount", "description", "category__name", "datetime"))
        totalTransactions = len(transactions)

        return JsonResponse({
            "transactions": data,
            "has_next": page_obj.has_next(),
            "has_previous": page_obj.has_previous(),
            "totalTransactions": totalTransactions,
            "current_page": page_obj.number
        })
    else:
        return JsonResponse({"error": "Invalid Request"}, status=404)

    

def getTransaction(request):
    if request.method == "GET":
        username = request.GET.get("user")
        id = request.GET.get("id")
        try:
            transaction = Transaction.objects.filter(user__username=username).get(id=id)
            print(transaction)
            return JsonResponse({
                "amount": transaction.amount,
                "description": transaction.description,
                "category": transaction.category.name,
                "datetime": transaction.datetime
            }, status=200)
        except Transaction.DoesNotExist:
            return JsonResponse({
                "message": "Transaction not found"
            }, status=404)
    else:
        return JsonResponse({
            "message": "Invalid request"
        }, status=400)


def editTransaction(request):
    if request.method == "POST":
        transaction_data = json.loads(request.body)
        transaction_id = transaction_data.get("id")
        updated_amount = transaction_data.get("amount")
        updated_description = transaction_data.get("description")
        updated_category = transaction_data.get("category")
        updated_date = transaction_data.get("date")

        print(transaction_id, updated_amount, updated_category, updated_description, updated_date)

        try:
            transaction = Transaction.objects.get(id=transaction_id)
            transaction.amount = updated_amount
            transaction.description = updated_description
            transaction.category = Category.objects.get(name=updated_category)
            transaction.datetime = updated_date
            transaction.save()

            return JsonResponse({
                "message": "Transaction edited successfully"
            })
        except Transaction.DoesNotExist:
            return JsonResponse({
                "message": "Transaction not found"
            }, status=404)
    else:
        return JsonResponse({
            "message": "Inavlid request"
        }, status=400)
    

def getGraphData(request):
    if request.method == "GET":
        totalIncome = Transaction.objects.total_income(request.user)
        totalExpense = Transaction.objects.total_expense(request.user)
        totalSavings = Transaction.objects.total_savings(request.user)
        # print(totalExpense, totalIncome)
        return JsonResponse({
            "total_income": totalIncome,
            "total_expense": totalExpense,
            "total_savings": totalSavings
        })
    else:
        return JsonResponse({
            "message": "Inavlid request"
        }, status=400)

    

def deleteTransaction(request):
    if request.method == "POST":
        data = json.loads(request.body)
        transaction_id = data.get("id")
        try:
            transaction = Transaction.objects.get(id=transaction_id)
            # print(transaction)
            transaction.delete()
            print(transaction_id)
            return JsonResponse({
                "message": f"post {transaction_id} deleted successfully"
            })
        except Transaction.DoesNotExist:
            return JsonResponse({
                "message": "Transaction not found"
            }, status=404)
    return JsonResponse({
        "message": "Invalid Request"
    }, status=400)


@login_required
def dashboard(request):
    return render(request, "Tracker/dashboard.html")

@login_required
def transactions(request):
    return render(request, "Tracker/transactions.html")

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "Tracker/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "Tracker/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "Tracker/register.html")



def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("dashboard"))
        else:
            return render(request, "Tracker/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "Tracker/login.html")
                                                        

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))
