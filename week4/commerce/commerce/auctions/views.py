from decimal import Decimal, ROUND_DOWN
from django import forms
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.db.models import Max

from .models import User, AuctionListing, Comments, Bid 

class NewListing(forms.Form):
    itemName = forms.CharField(
        label="Title", 
        widget=forms.TextInput(attrs={
            "class": "form-control w-75 mb-4",
            "placeholder": "Title",
        })
    )

    imageLink = forms.URLField(
        label="Item Image Link", 
        required=False,
        widget=forms.TextInput(attrs={
            "class": "form-control w-75 mb-4",
            "placeholder": "Image Link",
        })
    )

    itemDescription = forms.CharField(
        label="Description",
        widget=forms.Textarea(attrs={
            "class": "form-control w-75 mb-4",
            "placeholder": "Description"
        })
    )

    startingBid = forms.DecimalField(
        label="Starting Bid",
        initial=0.00,
        min_value=0.00, 
        decimal_places=2,
        widget=forms.NumberInput(attrs={
            "class": "form-control mb-4",
            "style": "width: 150px"
        })
    )

    category = forms.CharField(
        label="Category",
        required=False,
        widget=forms.TextInput(attrs={
            "class": "form-control w-25 mb-5",
            "placeholder": "Category",
        })
    )


class BidForm(forms.Form):
    bid = forms.DecimalField(
        label="Bid",
        initial=0.00,
        min_value=0.00,
        decimal_places=2,
        widget=forms.NumberInput(attrs={
            "class": "form-control mb-4",
            "style": "width: 150px"
        })
    )


class CommentForm(forms.Form):
    content = forms.CharField(
        label="",
        widget=forms.Textarea(attrs={
            "class": "form-control w-75 m-3",
            "placeholder": "Write your comments here..."
        })
    )


def index(request):
    return render(request, "auctions/index.html", {
        "listings": AuctionListing.objects.filter(is_active=True)
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")
    

def new_listing(request):
    if request.method == "POST":
        title = request.POST["itemName"]
        link = request.POST["imageLink"]
        description = request.POST["itemDescription"]
        category = request.POST["category"]
        startBid = request.POST["startingBid"]

        newListing = AuctionListing()
        newListing.created_by = request.user
        newListing.item_name = title
        newListing.image_link = link
        newListing.item_description = description
        newListing.category = category
        newListing.start_bid = startBid
        newListing.save()

        return HttpResponseRedirect(reverse("index"))

    return render(request, "auctions/newListing.html", {
        "form": NewListing()
    })


def addToWatchlist(request):
    if request.method == "POST":
        item_id = request.POST.get("item_id")
        request.user.watchlist.add(item_id)
    return HttpResponseRedirect(reverse("watchlist"))


def removeFromWatchlist(request):
    if request.method == "POST":
        item_id = request.POST.get("item_id")
        request.user.watchlist.remove(item_id)
    return HttpResponseRedirect(reverse("watchlist"))


@login_required
def watchlist(request):
    return render(request, "auctions/watchlist.html", {
        "listings": request.user.watchlist.filter(is_active=True)
    })


@login_required
def closeAuction(request):
    if request.method == "POST":
        item_id = request.POST.get("item_id")
        item = AuctionListing.objects.get(pk=item_id)
        highest_bid = Bid.objects.filter(listing=item).aggregate(highest=Max("bid"))["highest"]
        if highest_bid is not None:
            item.is_active = False
            item.save()
        return HttpResponseRedirect(reverse("index"))


def listingPage(request, listing_id):
    bidForm = BidForm()
    listing = AuctionListing.objects.get(pk=listing_id)
    
    highest_bid = Bid.objects.filter(listing=listing).aggregate(highest = Max("bid"))["highest"]
    if highest_bid is None:
        highest_bid = listing.start_bid
    else:
        highest_bid = highest_bid.quantize(Decimal("0.01"), rounding=ROUND_DOWN)
    bidForm = BidForm(initial={"bid": highest_bid})
    bidForm.fields["bid"].widget.attrs["min"] = str(highest_bid + Decimal("0.01"))

    if listing.is_active == False:
        highest_bid = Bid.objects.filter(listing=listing).aggregate(highest=Max("bid"))["highest"]
        highest_bidder = Bid.objects.get(bid=highest_bid).user
        winner = highest_bidder
    else:   
        winner = None

    return render(request, "auctions/listing.html", {
        "listing": listing,
        "bid_form": bidForm, 
        "comments": listing.comments.all(), 
        "comment_form": CommentForm(), 
        "current_bid": highest_bid, 
        "winner": winner
    })

@login_required
def postComment(request):
    if request.method == "POST":
        comment = Comments()
        comment.author = request.user
        listing = AuctionListing.objects.get(pk=request.POST.get("listing_id"))
        comment.listing = listing
        form  = CommentForm(request.POST)
        if form.is_valid():
            comment.comment = form.cleaned_data["content"]
        comment.save()
        return HttpResponseRedirect(reverse("listingPage", args=[request.POST.get("listing_id")]))
    

@login_required
def deletePost(request):
    if request.method == "POST":
        comment_id = request.POST.get("comment_id")
        comment = Comments.objects.get(pk=comment_id)
        comment.delete()

        return HttpResponseRedirect(reverse("listingPage", args=[request.POST.get("listing_id")]))
    

@login_required
def placeBid(request):
    if request.method == "POST":
        bid = Bid()
        bid.user = request.user
        listing= AuctionListing.objects.get(pk=request.POST.get("listing_id"))
        bid.listing = listing
        form = BidForm(request.POST)
        if form.is_valid():
            bid.bid = form.cleaned_data["bid"]
            bid.save()
        
        return HttpResponseRedirect(reverse("listingPage", args=[request.POST.get("listing_id")]))
    

def category(request):
    return render(request, "auctions/category.html")


def all(request):
    listings = AuctionListing.objects.all()
    listing_info = []
    for listing in listings:
        if not listing.is_active:
            highest_bid_obj = Bid.objects.filter(listing=listing).order_by('-bid').first()
            listing_info.append([listing.id, highest_bid_obj.user.username, highest_bid_obj.bid])

    return render(request, "auctions/category/all.html", {
        "listings": listings,
        "listing_info": listing_info
    })


def includeInactive(request):
    # show winners properly...
    # modify the code in includeInactive.hmtl too...
    return render(request, "auctions/category/includeInactive.html", {
        "listings": AuctionListing.objects.filter(is_active=False)
    })