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
<<<<<<< HEAD

=======
    path("send_email_otp/", views.send_email_otp),
    path("email_otp_handler/", views.email_otp_handler),
<<<<<<< HEAD
    path('check-student-exists/', views.check_student_exists),
=======
>>>>>>> e60b69195c275591289ce35296b3f923b7551852
>>>>>>> 9a5146254cc4653afe47b4755b098a5616ba062c
]