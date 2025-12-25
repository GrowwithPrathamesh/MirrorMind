from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('forgot_password/', views.forgot_password),
    path('email-otp-handler/', views.email_otp_handler),
]
