from django.db import models
from django.db.models import Sum
from django.contrib.auth.models import User
from matplotlib import category


# Create your models here.

class TransactionManager(models.Manager):
    def total_income(self, user):
        return self.filter(user=user, category__name="income").aggregate(Sum("amount"))["amount__sum"] or 0
    
    def total_expense(self, user):
        return self.filter(user=user, category__name="expense").aggregate(Sum("amount"))["amount__sum"] or 0
    
    def total_savings(self, user):
        return self.total_income(user) - self.total_expense(user)
    

class Transaction(models.Model):
    objects = TransactionManager()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(
        decimal_places=2,
        max_digits=10
    )
    description = models.TextField()
    category = models.ForeignKey("Category", on_delete=models.CASCADE, blank=False, related_name="category")
    datetime = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transaction: {self.id}, {self.category}, {self.datetime}"


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
