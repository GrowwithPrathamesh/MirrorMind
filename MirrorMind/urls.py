from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home),
    path('student-signup/', views.student_signup),
    path('teacher-signup/', views.teacher_signup),
    path("email-otp/", views.email_otp_handler),
    path("student-reset-password/", views.student_reset_password),
    path("teacher-reset-password/", views.teacher_reset_password),
    path("student-login/", views.student_login),
    path("teacher-login/", views.teacher_login),
]