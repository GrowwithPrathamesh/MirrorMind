from django.http import JsonResponse
from django.shortcuts import render
from django.core.files.base import ContentFile
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.models import User

from django.contrib.auth.hashers import make_password

from django.utils import timezone
from datetime import datetime, timedelta

from datetime import datetime
import base64
import json
import random
import smtplib
from email.mime.text import MIMEText
import json

from students.models import Student, StudentFace
from teachers.models import Teacher

from django.contrib.auth.hashers import check_password




otp_storage = {}


# ===============================
# BASIC PAGES
# ===============================
def home(request):
    return render(request, "home.html")


def student_login(request):
    if request.method == "POST":
        try:
            email = request.POST.get("email")
            password = request.POST.get("password")

            if not email or not password:
                return JsonResponse({
                    "success": False,
                    "error": "Email and password required"
                }, status=400)

            student = Student.objects.filter(email=email).first()

            if not student:
                return JsonResponse({
                    "success": False,
                    "error": "Student not found"
                }, status=404)

            if not check_password(password, student.password):
                return JsonResponse({
                    "success": False,
                    "error": "Invalid credentials"
                }, status=401)

            if not student.is_active:
                return JsonResponse({
                    "success": False,
                    "error": "Account is inactive"
                }, status=403)

            # ✅ SESSION LOGIN
            request.session["student_id"] = student.id
            request.session["user_type"] = "student"

            return JsonResponse({
                "success": True,
                "message": "Student login successful"
            })

        except Exception as e:
            print("STUDENT LOGIN ERROR:", e)
            return JsonResponse({
                "success": False,
                "error": "Internal server error"
            }, status=500)

    return render(request, "student_login.html")



def teacher_login(request):
    if request.method == "POST":
        try:
            email = request.POST.get("email")
            password = request.POST.get("password")

            if not email or not password:
                return JsonResponse({
                    "success": False,
                    "error": "Email and password required"
                }, status=400)

            teacher = Teacher.objects.filter(email=email).first()

            if not teacher:
                return JsonResponse({
                    "success": False,
                    "error": "Teacher not found"
                }, status=404)

            if not check_password(password, teacher.password):
                return JsonResponse({
                    "success": False,
                    "error": "Invalid credentials"
                }, status=401)

            if not teacher.is_active:
                return JsonResponse({
                    "success": False,
                    "error": "Account is inactive"
                }, status=403)

            # ✅ SESSION LOGIN
            request.session["teacher_id"] = teacher.id
            request.session["user_type"] = "teacher"

            return JsonResponse({
                "success": True,
                "message": "Teacher login successful"
            })

        except Exception as e:
            print("TEACHER LOGIN ERROR:", e)
            return JsonResponse({
                "success": False,
                "error": "Internal server error"
            }, status=500)

    return render(request, "teacher_login.html")



def student_signup(request):
    if request.method == "POST":
        try:
            data = request.POST

            first_name = data.get("first_name", "").strip()
            last_name = data.get("last_name", "").strip()
            email = data.get("email", "").strip()
            enrollment_no = data.get("enrollment_no", "").strip()
            department = data.get("department", "").strip()
            dob_raw = data.get("dob", "").strip()

            password = data.get("password", "")
            confirm_password = data.get("confirm_password", "")
            terms_accepted = data.get("terms")

            parent_name = data.get("parent_name", "").strip()
            parent_email = data.get("parent_email", "").strip()
            parent_mobile = data.get("parent_mobile", "").strip()

            face_image_base64 = data.get("face_image")

            if not all([
                first_name, last_name, email,
                enrollment_no, department,
                dob_raw, password, confirm_password
            ]):
                return JsonResponse({"error": "Missing required fields"}, status=400)

            if password != confirm_password:
                return JsonResponse({"error": "Passwords do not match"}, status=400)

            if not terms_accepted:
                return JsonResponse({"error": "Terms not accepted"}, status=400)

            verified_email = request.session.get("student_email_verified")
            otp_time = request.session.get("student_otp_time")

            if not verified_email or verified_email != email:
                return JsonResponse({"error": "Email not verified"}, status=403)

            if not otp_time:
                return JsonResponse({"error": "OTP expired"}, status=403)

            otp_time = datetime.fromisoformat(otp_time)
            if timezone.now() > otp_time + timedelta(minutes=5):
                request.session.pop("student_email_verified", None)
                request.session.pop("student_otp_time", None)
                return JsonResponse({"error": "OTP expired"}, status=403)

            if Student.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already registered"}, status=400)

            if Student.objects.filter(enrollment_no=enrollment_no).exists():
                return JsonResponse({"error": "Enrollment already exists"}, status=400)

            if not face_image_base64:
                return JsonResponse({"error": "Face capture required"}, status=400)

            try:
                format_part, imgstr = face_image_base64.split(";base64,")
                if not format_part.startswith("data:image/"):
                    raise ValueError
                ext = format_part.split("/")[-1]
            except Exception:
                return JsonResponse({"error": "Invalid face image"}, status=400)

            try:
                dob = datetime.strptime(dob_raw, "%Y-%m-%d").date()
            except ValueError:
                try:
                    dob = datetime.strptime(dob_raw, "%d/%m/%Y").date()
                except ValueError:
                    return JsonResponse({"error": "Invalid DOB"}, status=400)

            with transaction.atomic():
                student = Student.objects.create(
                    username=enrollment_no,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name,
                    enrollment_no=enrollment_no,
                    department=department,
                    dob=dob,
                    parent_name=parent_name or None,
                    parent_email=parent_email or None,
                    parent_mobile=parent_mobile or None,
                    email_verified=True,
                    face_registered=True,
                    terms_accepted=True
                )

                image_file = ContentFile(
                    base64.b64decode(imgstr),
                    name=f"student_{student.id}.{ext}"
                )

                StudentFace.objects.create(
                    student=student,
                    face_image=image_file
                )

            request.session.pop("student_email_verified", None)
            request.session.pop("student_otp_time", None)

            return JsonResponse({
                "success": True,
                "student_id": student.id
            })

        except Exception as e:
            print("STUDENT SIGNUP ERROR:", e)
            return JsonResponse({"error": "Internal server error"}, status=500)

    return render(request, "student_signup.html")


# ===============================
# TEACHER SIGNUP
# ===============================
def teacher_signup(request):
    if request.method == "POST":
        try:
            data = request.POST

            first_name = data.get("firstName")
            last_name = data.get("lastName")
            teacher_id = data.get("teacherId")
            email = data.get("email")
            department = data.get("department")
            institute = data.get("institute")

            qualification = data.get("qualification")
            experience = data.get("experience")

            password = data.get("password")
            confirm_password = data.get("confirm_password")

            required_fields = [
                first_name, last_name, teacher_id,
                email, department, institute,
                password, confirm_password
            ]

            if not all(required_fields):
                return JsonResponse({"error": "Missing required fields"}, status=400)

            if password != confirm_password:
                return JsonResponse({"error": "Passwords do not match"}, status=400)

            if request.session.get("teacher_email_verified") != email:
                return JsonResponse({"error": "Email not verified via OTP"}, status=403)

            if Teacher.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already registered"}, status=400)

            if Teacher.objects.filter(teacher_id=teacher_id).exists():
                return JsonResponse({"error": "Teacher ID already exists"}, status=400)

            with transaction.atomic():
                teacher = Teacher.objects.create_user(
                    username=teacher_id,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name,
                    teacher_id=teacher_id,
                    department=department,
                    institute=institute,
                    qualification=qualification,
                    experience=experience,
                    email_verified=True,
                    terms_accepted=True,
                    is_active=True
                )

            request.session.pop("teacher_email_verified", None)

            return JsonResponse({
                "success": True,
                "message": "Teacher registered successfully",
                "teacher_id": teacher.id
            })

        except Exception as e:
            print("TEACHER SIGNUP ERROR:", e)
            return JsonResponse({"error": "Internal server error"}, status=500)

    return render(request, "teacher_signup.html")


# ===============================
# EMAIL OTP
# ===============================
def send_email_otp(receiver_email, otp, purpose):
    sender_email = "rakshak.connect@gmail.com"
    sender_password = "vpxiebniktusbtxk"

    subject_map = {
        "student_signup": "MirrorMind | Student Email Verification OTP",
        "teacher_signup": "MirrorMind | Teacher Email Verification OTP",
        "forgot_password": "MirrorMind | Password Reset OTP"
    }

    body = f"""
Your OTP is: {otp}

Do not share this OTP with anyone.
This OTP is valid for a short time only.
"""

    msg = MIMEText(body)
    msg["Subject"] = subject_map.get(purpose, "MirrorMind OTP")
    msg["From"] = sender_email
    msg["To"] = receiver_email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.send_message(msg)
        return True
    except Exception as e:
        print("EMAIL OTP ERROR:", e)
        return False


@csrf_exempt
def email_otp_handler(request):
    if request.method == "POST":
        data = json.loads(request.body)
        action = data.get("action")
        email = data.get("email")
        purpose = data.get("purpose")
        otp_input = data.get("otp")

        if action == "send_otp":
            otp = str(random.randint(100000, 999999))
            otp_storage[email] = otp

            if send_email_otp(email, otp, purpose):
                return JsonResponse({"success": "OTP sent"})
            return JsonResponse({"error": "Failed to send OTP"}, status=500)

        if action == "verify_otp":
            if otp_storage.get(email) == otp_input:
                otp_storage.pop(email, None)

                if purpose == "student_signup":
                    request.session["student_email_verified"] = email
                elif purpose == "teacher_signup":
                    request.session["teacher_email_verified"] = email
                else:
                    request.session["reset_email_verified"] = email

                return JsonResponse({"verified": True})

            return JsonResponse({"verified": False}, status=400)

    return render(request, "email_otp.html")



# ===============================
# RESET PASSWORD
# ===============================
@csrf_exempt
def student_reset_password(request):
    if request.method == "POST":
        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        if password != confirm_password:
            return JsonResponse({"error": "Passwords do not match"}, status=400)

        if request.session.get("reset_email_verified") != email:
            return JsonResponse({"error": "OTP verification required"}, status=403)

        student = Student.objects.filter(email=email).first()
        if not student:
            return JsonResponse({"error": "Student not found"}, status=404)

        student.password = make_password(password)
        student.save(update_fields=["password"])

        request.session.pop("reset_email_verified", None)

        return JsonResponse({"success": True})

    return render(request, "student_reset_password.html")


@csrf_exempt
def teacher_reset_password(request):
    if request.method == "POST":
        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        if password != confirm_password:
            return JsonResponse({"error": "Passwords do not match"}, status=400)

        if request.session.get("reset_email_verified") != email:
            return JsonResponse({"error": "OTP verification required"}, status=403)

        teacher = Teacher.objects.filter(email=email).first()
        if not teacher:
            return JsonResponse({"error": "Teacher not found"}, status=404)

        teacher.password = make_password(password)
        teacher.save(update_fields=["password"])

        request.session.pop("reset_email_verified", None)

        return JsonResponse({"success": True})


    return render(request, "teacher_reset_password.html")