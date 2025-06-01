from django import forms
from django.http import HttpResponseRedirect
from django.shortcuts import render, reverse
import markdown2, random

from . import util

class NewPageForm(forms.Form):
    title = forms.CharField(
        label="Title", 
        widget=forms.TextInput(attrs={
            "class": "form-control w-75 mb-4",
            "id": "floatingTextarea",
            "placeholder": "Enter Page Title"
        })
    )
    content = forms.CharField(
        label="Content",
        widget=forms.Textarea(attrs={
            "class": "form-control w-75 mb-5", 
            "id": "floatingTextarea",
            "placeholder": "Markdown Supported"
        })
    )


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def new(request):
    if request.method == "POST":
        form = NewPageForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data["title"]
            content = form.cleaned_data["content"]

            if title in util.list_entries():
                return render(request, "encyclopedia/error.html", {
                    "error": "Entry already exists!"
                })
            
            util.save_entry(title, content)
            return HttpResponseRedirect(reverse('index'))
    return render(request, "encyclopedia/newPage.html", {
        "form": NewPageForm()
    })

def entry(request, title):
    if title == "random":
        title = random.choice(util.list_entries())
        return render(request, "encyclopedia/content.html", {
            "title": title, 
            "content": markdown2.markdown(util.get_entry(title))
        })
    
    if title not in util.list_entries():
        return render(request, "encyclopedia/error.html", {
            "error": "Entry Not Found!"
        })
    
    return render(request, "encyclopedia/content.html", {
        "title": title, 
        "content": markdown2.markdown(util.get_entry(title))
    })


def edit(request, title):
    if request.method == "POST":
        form = NewPageForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data["title"]
            content = form.cleaned_data["content"]
            util.save_entry(title, content)
            return HttpResponseRedirect(reverse('index'))

    loadedForm = NewPageForm(initial={
        "title": title, 
        "content": util.get_entry(title)
    })
    
    return render(request, "encyclopedia/edit.html", {
        "form": loadedForm,
        "title": title,
    })


def search_entry(request):
    query = request.GET.get('q')

    if query not in util.list_entries():
        return render(request, "encyclopedia/index.html", {
            "entries": util.list_entries()
        })

    return render(request, "encyclopedia/content.html", {
        "title": query,
        "content": markdown2.markdown(util.get_entry(query))
    })