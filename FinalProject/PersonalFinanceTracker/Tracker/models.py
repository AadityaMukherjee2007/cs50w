from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Transaction(models.Model):
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
    name = models.TextField(max_length=100, unique=True)

    def __str__(self):
        return self.name
