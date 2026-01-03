from django.http import JsonResponse
from django.shortcuts import render
from django.core.files.base import ContentFile
from django.db import transaction
from datetime import datetime
import base64
from students.models import Student, StudentFace

def student_signup(request):
    if request.method == "POST":
        try:
            data = request.POST

            # ===============================
            # 1️⃣ BASIC DETAILS (STEP 1)
            # ===============================
            first_name = data.get("first_name")
            last_name = data.get("last_name")
            email = data.get("email")
            enrollment_no = data.get("enrollment_no")
            department = data.get("department")
            dob_raw = data.get("dob")

            parent_name = data.get("parent_name")
            parent_email = data.get("parent_email")
            parent_mobile = data.get("parent_mobile")

            # ===============================
            # 2️⃣ SECURITY (STEP 4)
            # ===============================
            password = data.get("password")
            confirm_password = data.get("confirm_password")
            terms_accepted = data.get("terms")

            # ===============================
            # 3️⃣ FACE DATA (STEP 2)
            # ===============================
            face_image_base64 = data.get("face_image")

            # ===============================
            # VALIDATIONS
            # ===============================
            required_fields = [
                first_name, last_name, email, enrollment_no,
                department, dob_raw, password, confirm_password
            ]

            if not all(required_fields):
                return JsonResponse({"error": "Missing required fields"}, status=400)

            if password != confirm_password:
                return JsonResponse({"error": "Passwords do not match"}, status=400)

            if not terms_accepted:
                return JsonResponse({"error": "Terms not accepted"}, status=400)

            # ===============================
            # 4️⃣ OTP VERIFICATION CHECK (STEP 3)
            # ===============================
            if request.session.get("email_verified") != email:
                return JsonResponse(
                    {"error": "Email not verified via OTP"}, status=403
                )

            # ===============================
            # 5️⃣ DUPLICATE CHECK
            # ===============================
            if Student.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already registered"}, status=400)

            if Student.objects.filter(enrollment_no=enrollment_no).exists():
                return JsonResponse(
                    {"error": "Enrollment number already exists"}, status=400
                )

            # ===============================
            # 6️⃣ FACE VALIDATION
            # ===============================
            if not face_image_base64:
                return JsonResponse(
                    {"error": "Face capture is required"}, status=400
                )

            try:
                format, imgstr = face_image_base64.split(";base64,")
                if not format.startswith("data:image/"):
                    return JsonResponse({"error": "Invalid image format"}, status=400)
            except ValueError:
                return JsonResponse({"error": "Invalid face image"}, status=400)

            # ===============================
            # DOB FORMAT FIX (DD/MM/YYYY → YYYY-MM-DD)
            # ===============================
            try:
                dob = datetime.strptime(dob_raw, "%d/%m/%Y").date()
            except ValueError:
                return JsonResponse({"error": "Invalid date format"}, status=400)

            # ===============================
            # 7️⃣ CREATE STUDENT + FACE (ATOMIC)
            # ===============================
            with transaction.atomic():

                student = Student.objects.create_user(
                    username=enrollment_no,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name,
                    enrollment_no=enrollment_no,
                    department=department,
                    dob=dob,
                    parent_name=parent_name,
                    parent_email=parent_email,
                    parent_mobile=parent_mobile,
                    is_active=True,
                    email_verified=True,
                    terms_accepted=True
                )

                ext = format.split("/")[-1]
                face_image = ContentFile(
                    base64.b64decode(imgstr),
                    name=f"{student.id}_face.{ext}"
                )

                StudentFace.objects.create(
                    student=student,
                    face_image=face_image
                )

                student.face_registered = True
                student.save(update_fields=["face_registered"])

            # ===============================
            # 8️⃣ CLEAR OTP SESSION
            # ===============================
            request.session.pop("email_verified", None)

            return JsonResponse({
                "success": True,
                "message": "Student registered successfully",
                "student_id": student.id
            })

        except Exception as e:
            print("STUDENT SIGNUP ERROR:", e)
            return JsonResponse(
                {"error": "Internal server error"}, status=500
            )

    return render(request, 'student_signup.html')