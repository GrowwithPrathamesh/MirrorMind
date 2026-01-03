from django.db import models
from django.utils import timezone


# =========================================================
# TEACHER MODEL (SIMPLE USER)
# =========================================================
class Teacher(models.Model):
    """
    Simple Teacher model (no AbstractUser / no auth system)
    """

    # -----------------------------
    # BASIC INFO (STEP 1)
    # -----------------------------
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)
    teacher_id = models.CharField(max_length=50, unique=True)

    password = models.CharField(max_length=128)  # store hashed password

    department = models.CharField(max_length=150)
    institute = models.CharField(max_length=200)

    qualification = models.CharField(
        max_length=50,
        choices=[
            ("phd", "PhD"),
            ("masters", "Masters"),
            ("bachelors", "Bachelors"),
            ("diploma", "Diploma"),
            ("other", "Other"),
        ],
        blank=True,
        null=True
    )

    experience = models.CharField(
        max_length=20,
        choices=[
            ("0-2", "0-2 years"),
            ("3-5", "3-5 years"),
            ("6-10", "6-10 years"),
            ("10+", "10+ years"),
        ],
        blank=True,
        null=True
    )

    # -----------------------------
    # VERIFICATION & STATUS
    # -----------------------------
    email_verified = models.BooleanField(default=False)
    terms_accepted = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)

    # -----------------------------
    # TIMESTAMPS
    # -----------------------------
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)

    # -----------------------------
    # STRING
    # -----------------------------
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.teacher_id})"

    # =====================================================
    # BUSINESS LOGIC
    # =====================================================
    def verify_email(self):
        self.email_verified = True
        self.save(update_fields=["email_verified"])

    def deactivate_account(self):
        self.is_active = False
        self.save(update_fields=["is_active"])

    def activate_account(self):
        self.is_active = True
        self.save(update_fields=["is_active"])

    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def is_profile_complete(self):
        return all([
            self.first_name,
            self.last_name,
            self.department,
            self.institute,
            self.teacher_id
        ])