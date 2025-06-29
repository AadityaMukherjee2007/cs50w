from django.http import JsonResponse
from django.shortcuts import render
import time, json

# Create your views here.


def index(request):
    return render(request, "scroll/index.html")

def posts(request):
    start = int(request.GET.get("start"))
    end = int(request.GET.get("end"))

    data = []

    for i in range(start, end + 1):
        data.append(f"Post #{i}")

    time.sleep(1)

    return JsonResponse({"posts": data}) 