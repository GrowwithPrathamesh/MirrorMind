from django.contrib import admin
from .models import Teacher


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "first_name",
        "last_name",
        "email",
        "teacher_id",
        "department",
        "institute",
        "email_verified",
        "is_active",
        "date_joined",
    )

    list_filter = (
        "department",
        "email_verified",
        "is_active",
        "date_joined",
    )

    search_fields = (
        "first_name",
        "last_name",
        "email",
        "teacher_id",
    )

    ordering = ("-date_joined",)