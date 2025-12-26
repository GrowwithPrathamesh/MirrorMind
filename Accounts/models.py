from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    username = None  # username काढून टाकला
    email = models.EmailField(unique=True)

    mobile = models.CharField(max_length=15, blank=True, null=True)
    profile_photo = models.ImageField(upload_to="profiles/", blank=True, null=True)

    is_email_verified = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email