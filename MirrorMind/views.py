import json
import random
import smtplib
from email.mime.text import MIMEText

from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login
from django.http import HttpResponseRedirect



otp_storage = {}

def home(request):
    return render(request, "index.html")

def login_view(request):
    if request.method == "POST":
        username = request.POST.get("email")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            auth_login(request, user)
            return HttpResponseRedirect("/dashboard/")
        else:
            messages.error(request, "Invalid email or password.")
            return HttpResponseRedirect("/login/")

    return render(request, "login.html")





def forgot_password(request):
    if request.method == "GET":
        return render(request, "forgot_password.html")

    if request.method == "POST":
        email = request.POST.get("email")
        new_password = request.POST.get("password")
        confirm_password = request.POST.get("confirmPassword")

        if request.session.get("reset_email_verified") != email:
            return JsonResponse({"error": "OTP verification required."}, status=403)

        if not new_password or not confirm_password:
            return JsonResponse({"error": "Password fields cannot be empty."}, status=400)

        if new_password != confirm_password:
            return JsonResponse({"error": "Passwords do not match."}, status=400)

        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)

        request.session.pop("reset_email_verified", None)
        return JsonResponse({"success": "Password reset successful."})

    return JsonResponse({"error": "Invalid request method."}, status=405)


# ----------------------------
# EMAIL OTP SENDER
# ----------------------------
def send_email_otp(receiver_email, otp, purpose="signup"):
    sender_email = "rakshak.connect@gmail.com"
    sender_password = "vpxiebniktusbtxk"

    subject = "BrainWave | Email Verification OTP" if purpose == "signup" else "BrainWave | Password Reset OTP"
    body = f"Your OTP is:\n\n{otp}\n\nDo not share this OTP."

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
        print("Email error:", e)
        return False


# ----------------------------
# OTP HANDLER
# ----------------------------
@csrf_exempt
def email_otp_handler(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request"}, status=400)

    data = json.loads(request.body)
    action = data.get("action")
    email = data.get("email")
    purpose = data.get("purpose")

    if action == "send_otp":
        if purpose == "signup" and User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already registered"}, status=400)

        if purpose == "forgot" and not User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email not registered"}, status=400)

        otp = str(random.randint(100000, 999999))
        otp_storage[email] = otp

        if send_email_otp(email, otp, purpose):
            return JsonResponse({"success": "OTP sent successfully"})

        return JsonResponse({"error": "Failed to send OTP"}, status=500)

    if action == "verify_otp":
        if otp_storage.get(email) == data.get("otp"):
            del otp_storage[email]

            if purpose == "signup":
                request.session["email_verified"] = email
            else:
                request.session["reset_email_verified"] = email

            return JsonResponse({"verified": True})

        return JsonResponse({"verified": False}, status=400)

    return JsonResponse({"error": "Invalid action"}, status=400)
