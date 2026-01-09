import os
import base64
import json
import random
import smtplib

from datetime import datetime, timedelta

from django.http import JsonResponse
from django.shortcuts import render
from django.core.files.base import ContentFile
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone

from email.mime.text import MIMEText

from students.models import Student, StudentFace
from teachers.models import Teacher


# 🔒 CONSTANT
OTP_EXPIRY_MINUTES = 5

# ❗ Kept as requested (not used anymore)
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
# ===============================
@csrf_exempt
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
                return JsonResponse({"success": False, "error": "Email and password are required"}, status=400)

            teacher = Teacher.objects.filter(email=email).first()

            if not teacher:
                print("❌ Teacher not found for email:", email)
                return JsonResponse({"success": False, "error": "Teacher not found"}, status=404)

            print("✅ Teacher found:", teacher.full_name())

            if not teacher.is_active:
                print("❌ Teacher account inactive:", email)
                return JsonResponse({"success": False, "error": "Account is inactive"}, status=403)

            # ✅ FIXED PASSWORD CHECK
            if not check_password(password, teacher.password):
                print("❌ Invalid password for:", email)
                return JsonResponse({"success": False, "error": "Invalid credentials"}, status=401)

            request.session["teacher_id"] = teacher.id
            request.session["user_type"] = "teacher"

            teacher.last_login = timezone.now()
            teacher.save(update_fields=["last_login"])

            print("✅ Teacher login successful:", email)
            return JsonResponse({"success": True, "message": "Teacher login successful"})

        except Exception as e:
            print("🔥 TEACHER LOGIN ERROR:", str(e))
            return JsonResponse({"success": False, "error": "Internal server error"}, status=500)

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
                if ";base64," not in face_image_base64:
                    raise ValueError("Missing base64 data")
                format_part, imgstr = face_image_base64.split(";base64,")
                print("format_part:", format_part)

                if not format_part.startswith("data:image/"):
                    print("❌ Invalid image format")
                    raise ValueError("Invalid image format")

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





def send_email_otp(receiver_email, otp, purpose="signup", role="student"):
    EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")        # your gmail
    EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")  # app password

    # ---------- SUBJECT ----------
    if purpose == "signup":
        subject = f"MirrorMind | {role.capitalize()} Email Verification OTP"
    else:
        subject = f"MirrorMind | {role.capitalize()} Password Reset OTP"

    # ---------- BODY ----------
    if purpose == "signup" and role == "student":
        body = f"""
Hello Student 👋,

Welcome to MirrorMind 🎓

Your Email Verification OTP is:

🔐 {otp}

Please enter this OTP to complete your student registration.
This OTP is valid for 5 minutes.

⚠️ Do not share this OTP with anyone.

– MirrorMind Team
"""

    elif purpose == "signup" and role == "teacher":
        body = f"""
Hello Teacher 👨‍🏫,

Welcome to MirrorMind – Smart Classroom Platform.

Your Email Verification OTP is:

🔐 {otp}

Verify your email to activate your teacher account.
This OTP is valid for 5 minutes.

⚠️ Do not share this OTP with anyone.

– MirrorMind Team
"""

    elif purpose == "forgot" and role == "student":
        body = f"""
Hello Student 👋,

We received a request to reset your MirrorMind password.

Your Password Reset OTP is:

🔐 {otp}

Use this OTP to set a new password.
This OTP is valid for 5 minutes.

If you did not request this, please ignore this email.

– MirrorMind Team
"""

    elif purpose == "forgot" and role == "teacher":
        body = f"""
Hello Teacher 👨‍🏫,

A password reset request was initiated for your MirrorMind account.

Your Password Reset OTP is:

🔐 {otp}

Use this OTP to reset your password.
This OTP is valid for 5 minutes.

If this wasn't you, please ignore this email.

– MirrorMind Team
"""

    else:
        return False

    # ---------- EMAIL SEND ----------
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL_HOST_USER
    msg["To"] = receiver_email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
            server.send_message(msg)
        return True

    except Exception as e:
        print("EMAIL OTP ERROR:", e)
        return False



@csrf_protect
def email_otp_handler(request):
    # ✅ STRICT POST CHECK
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    action = data.get("action")
    email = data.get("email")
    purpose = data.get("purpose")   # signup | forgot
    role = data.get("role", "student")  # student | teacher

    if not action or not email or not purpose:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    # =========================
    # SEND OTP
    # =========================
    if action == "send_otp":

        # 🔍 EMAIL EXISTENCE CHECK
        if purpose == "signup":
            if role == "student" and Student.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already registered"}, status=400)

            if role == "teacher" and Teacher.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already registered"}, status=400)

        if purpose == "forgot":
            if role == "student" and not Student.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email not registered"}, status=400)

            if role == "teacher" and not Teacher.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email not registered"}, status=400)

        otp = str(random.randint(100000, 999999))
        expiry = timezone.now() + timedelta(minutes=5)

        # ✅ SESSION-BASED OTP (SAFE)
        request.session["otp_email"] = email
        request.session["otp_code"] = otp
        request.session["otp_expiry"] = expiry.isoformat()
        request.session["otp_purpose"] = purpose
        request.session["otp_role"] = role

        mail_sent = send_email_otp(email, otp, purpose, role)

        if not mail_sent:
            return JsonResponse({"error": "Failed to send OTP"}, status=500)

        return JsonResponse({"success": True})


    # =========================
    # VERIFY OTP
    # =========================
    elif action == "verify_otp":
        otp_input = data.get("otp")

        if not otp_input:
            return JsonResponse({"verified": False, "error": "OTP required"}, status=400)

        session_otp = request.session.get("otp_code")
        session_email = request.session.get("otp_email")
        session_expiry = request.session.get("otp_expiry")
        session_purpose = request.session.get("otp_purpose")
        session_role = request.session.get("otp_role")

        if not all([session_otp, session_email, session_expiry]):
            return JsonResponse({"verified": False, "error": "OTP expired or not sent"}, status=400)

        if email != session_email:
            return JsonResponse({"verified": False, "error": "Email mismatch"}, status=400)

        if timezone.now() > datetime.fromisoformat(session_expiry):
            request.session.flush()
            return JsonResponse({"verified": False, "error": "OTP expired"}, status=400)

        if otp_input != session_otp:
            return JsonResponse({"verified": False, "error": "Invalid OTP"}, status=400)

        # ✅ MARK VERIFIED
        if session_purpose == "signup":
            if session_role == "student":
                request.session["student_email_verified"] = email
                request.session["student_otp_verified_at"] = timezone.now().isoformat()
            else:
                request.session["teacher_email_verified"] = email

        elif session_purpose == "forgot":
            request.session["reset_email_verified"] = email

        # 🧹 CLEAN OTP SESSION
        request.session.pop("otp_code", None)
        request.session.pop("otp_expiry", None)

        return JsonResponse({"verified": True})

    return JsonResponse({"error": "Invalid action"}, status=400)



# ===============================
# RESET PASSWORD
# ===============================
@csrf_protect
def student_reset_password(request):
    print("➡️ student_reset_password VIEW CALLED")

    if request.method == "POST":
        print("✅ POST request received")

        try:
            data = json.loads(request.body)
            print("📦 Request JSON:", data)

            action = data.get("action")
            email = data.get("email", "").strip()

            print("🔧 Action:", action)
            print("📧 Email:", email)

            # =========================
            # STEP 1 : SEND OTP
            # =========================
            if action == "send_otp":
                print("📨 STEP 1 : SEND OTP")

                if not email:
                    print("❌ Email missing")
                    return JsonResponse({"error": "Email required"}, status=400)

                student = Student.objects.filter(email=email).first()
                if not student:
                    print("❌ Email not registered:", email)
                    return JsonResponse({"error": "Email not registered"}, status=404)

                otp = str(random.randint(100000, 999999))
                expiry = timezone.now() + timedelta(minutes=5)

                # ✅ SESSION-BASED OTP
                request.session["reset_otp"] = otp
                request.session["reset_otp_email"] = email
                request.session["reset_otp_expiry"] = expiry.isoformat()
                request.session["reset_otp_role"] = "student"

                print("🔐 OTP Generated:", otp)
                print("⏰ OTP Expiry:", expiry)

                email_status = send_email_otp(email, otp, purpose="forgot", role="student")
                print("📤 Email send status:", email_status)

                if not email_status:
                    print("❌ Failed to send OTP email")
                    return JsonResponse({"error": "Failed to send OTP"}, status=500)

                return JsonResponse({
                    "success": True,
                    "message": "OTP sent successfully"
                })

            # =========================
            # STEP 2 : VERIFY OTP
            # =========================
            elif action == "verify_otp":
                print("🔍 STEP 2 : VERIFY OTP")

                otp_input = data.get("otp", "").strip()

                session_otp = request.session.get("reset_otp")
                session_email = request.session.get("reset_otp_email")
                session_expiry = request.session.get("reset_otp_expiry")

                print("🔑 OTP Entered:", otp_input)
                print("📂 Session OTP:", session_otp)
                print("📧 Session Email:", session_email)
                print("⏳ Session Expiry:", session_expiry)

                if not (session_otp and session_email and session_expiry):
                    print("❌ OTP session missing")
                    return JsonResponse({"error": "OTP expired or not sent"}, status=403)

                if email != session_email:
                    print("❌ Email mismatch")
                    return JsonResponse({"error": "Email mismatch"}, status=403)

                if timezone.now() > datetime.fromisoformat(session_expiry):
                    print("❌ OTP expired by time")
                    request.session.pop("reset_otp", None)
                    request.session.pop("reset_otp_email", None)
                    request.session.pop("reset_otp_expiry", None)
                    return JsonResponse({"error": "OTP expired"}, status=403)

                if otp_input != session_otp:
                    print("❌ Invalid OTP")
                    return JsonResponse({"error": "Invalid OTP"}, status=403)

                request.session["reset_email_verified"] = email
                request.session.pop("reset_otp", None)
                request.session.pop("reset_otp_expiry", None)

                print("✅ OTP verified successfully")

                return JsonResponse({
                    "success": True,
                    "message": "OTP verified"
                })

            # =========================
            # STEP 3 : RESET PASSWORD
            # =========================
            elif action == "reset_password":
                print("🔁 STEP 3 : RESET PASSWORD")

                verified_email = request.session.get("reset_email_verified")
                print("📂 Verified email in session:", verified_email)

                if verified_email != email:
                    print("❌ OTP verification required")
                    return JsonResponse({"error": "OTP verification required"}, status=403)

                new_password = data.get("password", "").strip()
                print("🔑 New password length:", len(new_password))

                if not new_password or len(new_password) < 8:
                    print("❌ Password validation failed")
                    return JsonResponse(
                        {"error": "Password must be at least 8 characters"},
                        status=400
                    )

                student = Student.objects.filter(email=email).first()
                if not student:
                    print("❌ Student not found")
                    return JsonResponse({"error": "Email not found"}, status=404)

                student.password = make_password(new_password)
                student.save(update_fields=["password"])

                request.session.pop("reset_email_verified", None)

                print("✅ Password reset successful for:", email)

                return JsonResponse({
                    "success": True,
                    "message": "Password reset successful"
                })

            else:
                print("❌ Invalid action")
                return JsonResponse({"error": "Invalid action"}, status=400)

        except Exception as e:
            print("🔥 STUDENT RESET PASSWORD ERROR 🔥")
            print("Exception:", str(e))
            return JsonResponse({"error": "Internal server error"}, status=500)

    print("📄 Rendering student_reset_password.html")
    return render(request, "student_reset_password.html")


# ===============================
# TEACHER RESET PASSWORD
# ===============================
@csrf_protect
def teacher_reset_password(request):
    print("➡️ teacher_reset_password VIEW CALLED")

    if request.method == "POST":
        print("✅ POST request received")

        try:
            data = json.loads(request.body)
            print("📦 Request JSON:", data)

            action = data.get("action")
            email = data.get("email", "").strip()

            print("🔧 Action:", action)
            print("📧 Email:", email)

            # =========================
            # STEP 1 : SEND OTP
            # =========================
            if action == "send_otp":
                print("📨 STEP 1 : SEND OTP")

                if not email:
                    print("❌ Email missing")
                    return JsonResponse({"error": "Email required"}, status=400)

                teacher = Teacher.objects.filter(email=email).first()
                if not teacher:
                    print("❌ Email not registered:", email)
                    return JsonResponse({"error": "Email not registered"}, status=404)

                otp = str(random.randint(100000, 999999))
                expiry = timezone.now() + timedelta(minutes=5)

                # ✅ SESSION-BASED OTP
                request.session["reset_otp"] = otp
                request.session["reset_otp_email"] = email
                request.session["reset_otp_expiry"] = expiry.isoformat()
                request.session["reset_otp_role"] = "teacher"

                print("🔐 OTP Generated:", otp)
                print("⏰ OTP Expiry:", expiry)

                email_status = send_email_otp(email, otp, purpose="forgot", role="teacher")
                print("📤 Email send status:", email_status)

                if not email_status:
                    print("❌ Failed to send OTP email")
                    return JsonResponse({"error": "Failed to send OTP"}, status=500)

                return JsonResponse({
                    "success": True,
                    "message": "OTP sent successfully"
                })

            # =========================
            # STEP 2 : VERIFY OTP
            # =========================
            elif action == "verify_otp":
                print("🔍 STEP 2 : VERIFY OTP")

                otp_input = data.get("otp", "").strip()

                session_otp = request.session.get("reset_otp")
                session_email = request.session.get("reset_otp_email")
                session_expiry = request.session.get("reset_otp_expiry")

                print("🔑 OTP Entered:", otp_input)
                print("📂 Session OTP:", session_otp)
                print("📧 Session Email:", session_email)
                print("⏳ Session Expiry:", session_expiry)

                if not (session_otp and session_email and session_expiry):
                    print("❌ OTP session missing")
                    return JsonResponse({"error": "OTP expired or not sent"}, status=403)

                if email != session_email:
                    print("❌ Email mismatch")
                    return JsonResponse({"error": "Email mismatch"}, status=403)

                if timezone.now() > datetime.fromisoformat(session_expiry):
                    print("❌ OTP expired by time")
                    request.session.pop("reset_otp", None)
                    request.session.pop("reset_otp_email", None)
                    request.session.pop("reset_otp_expiry", None)
                    return JsonResponse({"error": "OTP expired"}, status=403)

                if otp_input != session_otp:
                    print("❌ Invalid OTP")
                    return JsonResponse({"error": "Invalid OTP"}, status=403)

                request.session["reset_email_verified"] = email
                request.session.pop("reset_otp", None)
                request.session.pop("reset_otp_expiry", None)

                print("✅ OTP verified successfully")

                return JsonResponse({
                    "success": True,
                    "message": "OTP verified"
                })

            # =========================
            # STEP 3 : RESET PASSWORD
            # =========================
            elif action == "reset_password":
                print("🔁 STEP 3 : RESET PASSWORD")

                verified_email = request.session.get("reset_email_verified")
                print("📂 Verified email in session:", verified_email)

                if verified_email != email:
                    print("❌ OTP verification required")
                    return JsonResponse({"error": "OTP verification required"}, status=403)

                new_password = data.get("password", "").strip()
                print("🔑 New password length:", len(new_password))

                if not new_password or len(new_password) < 8:
                    print("❌ Password validation failed")
                    return JsonResponse(
                        {"error": "Password must be at least 8 characters"},
                        status=400
                    )

                teacher = Teacher.objects.filter(email=email).first()
                if not teacher:
                    print("❌ Teacher not found")
                    return JsonResponse({"error": "Email not found"}, status=404)

                teacher.password = make_password(new_password)
                teacher.save(update_fields=["password"])

                request.session.pop("reset_email_verified", None)

                print("✅ Password reset successful for:", email)

                return JsonResponse({
                    "success": True,
                    "message": "Password reset successful"
                })

            else:
                print("❌ Invalid action")
                return JsonResponse({"error": "Invalid action"}, status=400)

        except Exception as e:
            print("🔥 TEACHER RESET PASSWORD ERROR 🔥")
            print("Exception:", str(e))
            return JsonResponse({"error": "Internal server error"}, status=500)

    print("📄 Rendering teacher_reset_password.html")
    return render(request, "teacher_reset_password.html")



def check_student_exists(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("RAW DATA FROM JS:", data)   # 🔥 ADD THIS

            email = data.get('email', '').strip()
            enrollment_raw = data.get('enrollment_no', '')
            print("ENROLLMENT RAW:", enrollment_raw, type(enrollment_raw))

            enrollment = None
            if enrollment_raw != '':
                enrollment = int(enrollment_raw)

            print("ENROLLMENT FINAL:", enrollment, type(enrollment))

            enrollment_exists = False
            if enrollment is not None:
                enrollment_exists = Student.objects.filter(
                    enrollment_no=enrollment
                ).exists()

            print("ENROLLMENT EXISTS:", enrollment_exists)

            return JsonResponse({
                'enrollment_exists': enrollment_exists
            })

        except Exception as e:
            print("ERROR:", e)
            return JsonResponse({'error': str(e)}, status=400)
