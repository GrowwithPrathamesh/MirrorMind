from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home),
    path('login/', views.login_view),
    path('teacher-signup/', views.teacher_signup),
    path('student-signup/', views.student_signup),
    path('teacher-dashboard/', views.teacher_dashboard),
    path('student-dashboard/', views.student_dashboard),
    path('attendence/', views.attendence),
    # path('live-classes/', views.live_classes),
    path('forgot-password/', views.forgot_password),
    # path('logout/', views.logout_view),
    path('email-otp-handler/', views.email_otp_handler),
]