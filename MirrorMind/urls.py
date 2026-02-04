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
    path('student-reset-password/', views.student_reset_password),
    path('teacher-reset-password/', views.teacher_reset_password),

    # ✅ ONLY ONE OTP ENDPOINT
    path('email_otp_handler/', views.email_otp_handler),

    # Face
    path('process-frame/', views.process_frame),
    path('face-capture/', views.face_capture),

    # Utils
    path('check_student_exists/', views.check_student_exists),
    path('dashboard/', views.dashboard),








    path("attendance/", views.attendance_page),
    path("attendance/mark/", views.mark_attendance),
]
