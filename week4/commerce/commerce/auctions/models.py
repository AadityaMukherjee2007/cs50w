from django.contrib.auth.models import AbstractUser
from django.db import models
from sympy import true

class User(AbstractUser):
    watchlist = models.ManyToManyField("AuctionListing", blank=True, related_name="watchlisted_by")

    def __str__(self):
        return self.username

class AuctionListing(models.Model):
    item_name = models.CharField()
    image_link = models.URLField(null=True, blank=True)
    item_description = models.CharField()
    start_bid = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00
    )
    category = models.CharField(null=True, blank=True)
    created_by = models.ForeignKey("User", on_delete=models.CASCADE, related_name="listings")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"name: {self.item_name}, description: {self.item_description}, starting bid: {self.start_bid}"


class Comments(models.Model):
    author = models.ForeignKey("User", on_delete=models.CASCADE, related_name="user_comments")
    listing = models.ForeignKey("AuctionListing", on_delete=models.CASCADE, related_name="comments")
    comment = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"author: {self.author}, listing: {self.listing}, comment: {self.comment}"
    


class Bid(models.Model):
    listing = models.ForeignKey("AuctionListing", on_delete=models.CASCADE, related_name="bids")
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="bids_placed")
    bid = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00
    )

    def __str__(self):
        return f"user: {self.user}, item: {self.listing}, bid: {self.bid}"

