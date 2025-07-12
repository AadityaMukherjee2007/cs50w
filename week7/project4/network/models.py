from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField("self", symmetrical=False, blank=True, related_name="followers")

    def __str__(self):
        return f"username: {self.username}"
    
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField(blank=False, null=False)
    likes = models.ManyToManyField(User, blank=True, related_name="liked_posts")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"author: {self.author}, time: {self.timestamp}, content: {self.content}"