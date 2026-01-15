from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home),

    # Signup
    path('student-signup/', views.student_signup),
    path('teacher-signup/', views.teacher_signup),

    # Login
    path('student-login/', views.student_login),
    path('teacher-login/', views.teacher_login),

    # Reset Password
    path("student-reset-password/", views.student_reset_password),
    path("teacher-reset-password/", views.teacher_reset_password),

    # OTP
    path("email-otp/", views.email_otp_handler),
    path("send_email_otp/", views.send_email_otp),

    # Face capture processing
    path('process-frame/', views.process_frame),

    # Dashboard
    path('dashboard/', views.dashboard),
    path('face-capture/', views.face_capture),

    # OTP Sender
    path('email_otp_handler/', views.email_otp_handler,),
    path("check_student_exists/", views.check_student_exists),
]