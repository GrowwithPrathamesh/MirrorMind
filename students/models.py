from django.db import models
from django.utils import timezone

class Student(models.Model):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)  # store hashed password

    is_active = models.BooleanField(default=True)

    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)

    enrollment_no = models.CharField(max_length=50, unique=False)

    student_id = models.CharField(max_length=200, unique=True, blank=True, null=True)

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

    parent_name = models.CharField(max_length=100, null=True, blank=True)
    parent_email = models.EmailField(null=True, blank=True)
    parent_mobile = models.CharField(max_length=15, null=True, blank=True)

    email_verified = models.BooleanField(default=False)
    face_registered = models.BooleanField(default=False)
    terms_accepted = models.BooleanField(default=False)

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
        return f"{self.first_name} {self.last_name} | {self.email}"


class StudentFace(models.Model):
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

    captured_at = models.DateTimeField(default=timezone.now)