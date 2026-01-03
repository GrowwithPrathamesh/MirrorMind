from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home),
    path('student-signup/', views.student_signup),
    path('teacher-signup/', views.teacher_signup),
    path("email-otp/", views.email_otp_handler),
]