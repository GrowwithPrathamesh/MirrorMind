from django.http import JsonResponse
from django.shortcuts import render
from django.core.files.base import ContentFile
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from django.core.cache import cache
from django.utils import timezone

from datetime import datetime, timedelta
import base64
import json
import random
import smtplib
from email.mime.text import MIMEText

from students.models import Student, StudentFace
from teachers.models import Teacher


otp_storage = {}


def home(request):
    return render(request, "home.html")


# ===============================
# STUDENT LOGIN
# ===============================
def student_login(request):
    if request.method == "POST":
        try:
            email = request.POST.get("email")
            password = request.POST.get("password")

            if not email or not password:
                return JsonResponse({"success": False, "error": "Email and password required"}, status=400)

            student = Student.objects.filter(email=email).first()
            if not student:
                return JsonResponse({"success": False, "error": "Student not found"}, status=404)

            if not check_password(password, student.password):
                return JsonResponse({"success": False, "error": "Invalid credentials"}, status=401)

            if not student.is_active:
                return JsonResponse({"success": False, "error": "Account is inactive"}, status=403)

            request.session["student_id"] = student.id
            request.session["user_type"] = "student"

            return JsonResponse({"success": True, "message": "Student login successful"})

        except Exception as e:
            print("STUDENT LOGIN ERROR:", e)
            return JsonResponse({"success": False, "error": "Internal server error"}, status=500)

    return render(request, "student_login.html")


# ===============================
# TEACHER LOGIN
@csrf_exempt  # remove this if CSRF is handled via AJAX
def teacher_login(request):
    print("➡️ teacher_login view called")

    if request.method == "POST":
        print("✅ POST request received")

        try:
            email = request.POST.get("email")
            password = request.POST.get("password")

            print("📩 Email received:", email)
            print("🔑 Password received:", "YES" if password else "NO")

            if not email or not password:
                print("❌ Email or password missing")
                return JsonResponse(
                    {"success": False, "error": "Email and password are required"},
                    status=400
                )

            teacher = Teacher.objects.filter(email=email).first()

            if not teacher:
                print("❌ Teacher not found for email:", email)
                return JsonResponse(
                    {"success": False, "error": "Teacher not found"},
                    status=404
                )

            print("✅ Teacher found:", teacher.full_name())

            if not teacher.is_active:
                print("❌ Teacher account inactive:", email)
                return JsonResponse(
                    {"success": False, "error": "Account is inactive"},
                    status=403
                )

            # ❗ PLAIN TEXT PASSWORD CHECK (NO HASHING)
            if password != teacher.password:
                print("❌ Invalid password for:", email)
                return JsonResponse(
                    {"success": False, "error": "Invalid credentials"},
                    status=401
                )

            request.session["teacher_id"] = teacher.id
            request.session["user_type"] = "teacher"

            teacher.last_login = timezone.now()
            teacher.save(update_fields=["last_login"])

            print("✅ Teacher login successful:", email)
            print("🧠 Session teacher_id:", request.session.get("teacher_id"))

            return JsonResponse(
                {"success": True, "message": "Teacher login successful"},
                status=200
            )

        except Exception as e:
            print("🔥 TEACHER LOGIN ERROR:", str(e))
            return JsonResponse(
                {"success": False, "error": "Internal server error"},
                status=500
            )

    print("ℹ️ GET request – rendering login page")
    return render(request, "teacher_login.html")


# ===============================
# STUDENT SIGNUP
# ===============================
@csrf_protect
def student_signup(request):
    print("➡️ student_signup view called")

    if request.method == "POST":
        print("✅ REQUEST METHOD = POST")

        try:
            print("🔹 Entered TRY block")

            data = request.POST
            print("📦 request.POST data:", data)

            first_name = data.get("first_name", "").strip()
            print("first_name:", first_name)

            last_name = data.get("last_name", "").strip()
            print("last_name:", last_name)

            email = data.get("email", "").strip()
            print("email:", email)

            enrollment_no = data.get("enrollment_no", "").strip()
            print("enrollment_no:", enrollment_no)

            department = data.get("department", "").strip()
            print("department:", department)

            dob_raw = data.get("dob", "").strip()
            print("dob_raw:", dob_raw)

            password = data.get("password", "")
            print("password present:", bool(password))

            confirm_password = data.get("confirm_password", "")
            print("confirm_password present:", bool(confirm_password))

            terms_accepted = data.get("terms")
            print("terms_accepted:", terms_accepted)

            parent_name = data.get("parent_name", "").strip()
            print("parent_name:", parent_name)

            parent_email = data.get("parent_email", "").strip()
            print("parent_email:", parent_email)

            parent_mobile = data.get("parent_mobile", "").strip()
            print("parent_mobile:", parent_mobile)

            face_image_base64 = data.get("face_image")
            print("face_image_base64 present:", bool(face_image_base64))

            print("🔍 Checking required fields")
            if not all([
                first_name, last_name, email,
                enrollment_no, department,
                dob_raw, password, confirm_password
            ]):
                print("❌ Missing required fields")
                return JsonResponse({"error": "Missing required fields"}, status=400)

            print("🔍 Checking password match")
            if password != confirm_password:
                print("❌ Passwords do not match")
                return JsonResponse({"error": "Passwords do not match"}, status=400)

            print("🔍 Checking terms acceptance")
            if not terms_accepted:
                print("❌ Terms not accepted")
                return JsonResponse({"error": "Terms not accepted"}, status=400)

            verified_email = request.session.get("student_email_verified")
            otp_verified_at = request.session.get("student_otp_verified_at")

            print("📧 verified_email from session:", verified_email)
            print("⏱️ otp_verified_at from session:", otp_verified_at)

            if not verified_email or verified_email != email:
                print("❌ Email not verified or mismatch")
                return JsonResponse(
                    {"error": "Email not verified. Please complete OTP verification."},
                    status=403
                )

            if not otp_verified_at:
                print("❌ OTP verification timestamp missing")
                return JsonResponse({"error": "OTP verification required"}, status=403)

            print("⏳ Parsing OTP verified time")
            verified_time = datetime.fromisoformat(otp_verified_at)
            expiry_time = verified_time + timedelta(minutes=2)

            print("verified_time:", verified_time)
            print("expiry_time:", expiry_time)
            print("current_time:", timezone.now())

            if timezone.now() > expiry_time:
                print("❌ OTP expired")
                request.session.pop("student_email_verified", None)
                request.session.pop("student_otp_verified_at", None)
                return JsonResponse(
                    {"error": "OTP verification expired. Please verify again."},
                    status=403
                )

            print("🔍 Checking duplicate email")
            if Student.objects.filter(email=email).exists():
                print("❌ Email already registered")
                return JsonResponse({"error": "Email already registered"}, status=400)

            print("🔍 Checking duplicate enrollment")
            if Student.objects.filter(enrollment_no=enrollment_no).exists():
                print("❌ Enrollment already exists")
                return JsonResponse({"error": "Enrollment already exists"}, status=400)

            print("📸 Checking face image")
            if not face_image_base64:
                print("❌ Face image missing")
                return JsonResponse({"error": "Face capture required"}, status=400)

            print("📸 Parsing face image")
            try:
                format_part, imgstr = face_image_base64.split(";base64,")
                print("format_part:", format_part)

                if not format_part.startswith("data:image/"):
                    print("❌ Invalid image format")
                    raise ValueError

                ext = format_part.split("/")[-1]
                print("image extension:", ext)

            except Exception as img_err:
                print("❌ Face image parse error:", img_err)
                return JsonResponse({"error": "Invalid face image"}, status=400)

            print("📅 Parsing DOB")
            try:
                dob = datetime.strptime(dob_raw, "%Y-%m-%d").date()
                print("DOB parsed (YYYY-MM-DD):", dob)

            except ValueError:
                print("⚠️ Failed YYYY-MM-DD, trying DD/MM/YYYY")
                try:
                    dob = datetime.strptime(dob_raw, "%d/%m/%Y").date()
                    print("DOB parsed (DD/MM/YYYY):", dob)

                except ValueError as dob_err:
                    print("❌ DOB parse error:", dob_err)
                    return JsonResponse({"error": "Invalid DOB"}, status=400)

            print("🔐 Starting transaction.atomic()")
            with transaction.atomic():
                print("👤 Creating Student object")

                student = Student.objects.create(
                    username=enrollment_no,
                    email=email,
                    password=make_password(password),
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

                print("✅ Student created with ID:", student.id)

                print("📸 Saving face image to StudentFace")
                image_file = ContentFile(
                    base64.b64decode(imgstr),
                    name=f"student_{student.id}.{ext}"
                )

                StudentFace.objects.create(
                    student=student,
                    face_image=image_file
                )

                print("✅ Face image saved")

            print("🧹 Clearing session OTP data")
            request.session.pop("student_email_verified", None)
            request.session.pop("student_otp_verified_at", None)

            print("🎉 STUDENT REGISTRATION SUCCESS")
            return JsonResponse({
                "success": True,
                "student_id": student.id
            })

        except Exception as e:
            print("🔥 STUDENT SIGNUP EXCEPTION 🔥")
            print("Exception type:", type(e))
            print("Exception message:", e)
            return JsonResponse({"error": "Internal server error"}, status=500)

    print("⚠️ Non-POST request, rendering signup page")
    return render(request, "student_signup.html")


# ===============================
# TEACHER SIGNUP
# ===============================
def teacher_signup(request):
    if request.method == "POST":
        try:
            data = request.POST

            if request.session.get("teacher_email_verified") != data.get("email"):
                return JsonResponse({"error": "Email not verified"}, status=403)

            teacher = Teacher.objects.create_user(
                username=data.get("teacherId"),
                email=data.get("email"),
                password=data.get("password"),
                first_name=data.get("firstName"),
                last_name=data.get("lastName"),
                teacher_id=data.get("teacherId"),
                department=data.get("department"),
                institute=data.get("institute"),
                qualification=data.get("qualification"),
                experience=data.get("experience"),
                email_verified=True,
                terms_accepted=True,
                is_active=True
            )

            request.session.pop("teacher_email_verified", None)
            return JsonResponse({"success": True, "message": "Teacher registered successfully"})

        except Exception as e:
            print("TEACHER SIGNUP ERROR:", e)
            return JsonResponse({"error": "Internal server error"}, status=500)

    return render(request, "teacher_signup.html")



def send_email_otp(receiver_email, otp, purpose="signup"):
    sender_email = "rakshak.connect@gmail.com"
    sender_password = "vpxiebniktusbtxk" 

    subject = (
        "MirrorMind | Email Verification OTP"
        if purpose == "signup"
        else "MirrorMind | Password Reset OTP"
    )

    body = f"""Your OTP is:

        {otp}

        Do not share this OTP with anyone.
        """

    msg = MIMEText(body)
    msg["Subject"] = subject
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



@csrf_protect
def email_otp_handler(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    action = data.get("action")
    email = data.get("email")
    purpose = data.get("purpose")

    if not action or not email or not purpose:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    if action == "send_otp":
        if purpose == "signup" and Student.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already registered"}, status=400)

        if purpose == "forgot" and not Student.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email not registered"}, status=400)

        otp = str(random.randint(100000, 999999))
        expiry = timezone.now() + timedelta(minutes=2)

        otp_storage[email] = {
            "otp": otp,
            "expiry": expiry,
            "verified": False
        }

        mail_sent = send_email_otp(email, otp, purpose)

        if not mail_sent:
            return JsonResponse({"error": "Failed to send OTP"}, status=500)

        request.session[f"{purpose}_otp_time"] = timezone.now().isoformat()

        return JsonResponse({"success": True})

    elif action == "verify_otp":
        otp_input = data.get("otp")

        if not otp_input:
            return JsonResponse({"verified": False, "error": "OTP required"}, status=400)

        otp_data = otp_storage.get(email)
        if not otp_data:
            return JsonResponse({"verified": False, "error": "OTP not found or expired"}, status=400)

        if timezone.now() > otp_data["expiry"]:
            otp_storage.pop(email, None)
            return JsonResponse({"verified": False, "error": "OTP expired"}, status=400)

        if otp_data["otp"] == otp_input:
            otp_data["verified"] = True
            otp_storage[email] = otp_data

            if purpose == "signup":
                request.session["student_email_verified"] = email
                request.session["student_otp_verified_at"] = timezone.now().isoformat()
            elif purpose == "forgot":
                request.session["reset_email_verified"] = email

            return JsonResponse({"verified": True})

        return JsonResponse({"verified": False, "error": "Invalid OTP"}, status=400)

    return JsonResponse({"error": "Invalid action"}, status=400)



# ===============================
# RESET PASSWORD
# ===============================
@csrf_protect
def student_reset_password(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            if request.session.get("reset_email_verified") != data.get("email"):
                return JsonResponse({"error": "OTP verification required"}, status=403)

            student = Student.objects.filter(email=data.get("email")).first()
            student.password = make_password(data.get("password"))
            student.save(update_fields=["password"])

            request.session.pop("reset_email_verified", None)
            return JsonResponse({"success": True})
        except Exception as e:
            print("RESET PASSWORD ERROR:", e)
            return JsonResponse({"error": "Internal server error"}, status=500)

    return render(request, "student_reset_password.html")




@csrf_protect
def teacher_reset_password(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            if request.session.get("reset_email_verified") != data.get("email"):
                return JsonResponse({"error": "OTP verification required"}, status=403)

            teacher = Teacher.objects.filter(email=data.get("email")).first()
            teacher.password = make_password(data.get("password"))
            teacher.save(update_fields=["password"])

            request.session.pop("reset_email_verified", None)
            return JsonResponse({"success": True})
        except Exception as e:
            print("RESET PASSWORD ERROR:", e)
            return JsonResponse({"error": "Internal server error"}, status=500)

    return render(request, "teacher_reset_password.html")






















def check_student_exists(request):
    """Check if email or enrollment already exists"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email', '').strip()
            enrollment = data.get('enrollment', '').strip()
            
            email_exists = False
            enrollment_exists = False
            
            if email:
                email_exists = Student.objects.filter(email=email).exists()
            
            if enrollment:
                enrollment_exists = Student.objects.filter(enrollment_no=enrollment).exists()
            
            return JsonResponse({
                'email_exists': email_exists,
                'enrollment_exists': enrollment_exists
            })
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)