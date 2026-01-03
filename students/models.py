from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


# ============================
# STUDENT USER MODEL
# ============================
class Student(AbstractUser):
    """
    Custom Student model using Django AbstractUser
    """

    # ---- AUTH ----
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    # ---- BASIC DETAILS (STEP 1) ----
    enrollment_no = models.CharField(max_length=50, unique=True)

    department = models.CharField(
        max_length=50,
        choices=[
            ("computer_science", "Computer Science"),
            ("information_tech", "Information Technology"),
            ("electronics", "Electronics & Communication"),
            ("mechanical", "Mechanical Engineering"),
            ("civil", "Civil Engineering"),
            ("business", "Business Administration"),
            ("humanities", "Humanities"),
        ]
    )

    dob = models.DateField(null=True, blank=True)

    # ---- PARENT DETAILS (UNDER 10) ----
    parent_name = models.CharField(max_length=100, null=True, blank=True)
    parent_email = models.EmailField(null=True, blank=True)
    parent_mobile = models.CharField(max_length=15, null=True, blank=True)

    # ---- VERIFICATION FLAGS ----
    email_verified = models.BooleanField(default=False)
    face_registered = models.BooleanField(default=False)
    terms_accepted = models.BooleanField(default=False)

    # ---- META ----
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def age(self):
        if not self.dob:
            return None
        today = timezone.now().date()
        return today.year - self.dob.year - (
            (today.month, today.day) < (self.dob.month, self.dob.day)
        )

    def requires_parent_consent(self):
        return self.age() is not None and self.age() < 10

    def __str__(self):
        return f"{self.first_name} {self.last_name} | {self.enrollment_no}"


# ============================
# FACE DATA MODEL (STEP 2)
# ============================
class StudentFace(models.Model):
    """
    Stores captured face image & embedding
    """

    student = models.OneToOneField(
        Student,
        on_delete=models.CASCADE,
        related_name="face"
    )

    face_image = models.ImageField(
        upload_to="student_faces/",
        null=True,
        blank=True
    )

    face_encoding = models.BinaryField(
        null=True,
        blank=True,
        help_text="Pickled numpy array of face embedding"
    )

    liveness_passed = models.BooleanField(default=False)

    captured_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Face | {self.student.email}"