import random
import string

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django_redis import get_redis_connection
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .serializers import LoginSerializer, RegisterSerializer, UserSerializer

UserModel = get_user_model()


class ResetPasswordView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return JsonResponse({"status": "error", "message": "이미 로그인 중입니다"}, status=status.HTTP_400_BAD_REQUEST)

        email = request.data.get("email")
        if not email:
            return JsonResponse({"status": "error", "message": "이메일을 입력해주세요"}, status=status.HTTP_400_BAD_REQUEST)

        user = UserModel.objects.filter(email=email).first()
        if not user:
            return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        mail_subject = "Ion 비밀번호 재설정 요청"
        message = render_to_string(
            "reset_password_email.html",
            {
                "user": user,
                "domain": settings.DOMAIN,
                "uid": uid,
                "token": token,
            },
        )

        send_mail(mail_subject, message, f"noreply@{settings.EMAIL_DOMAIN}", [user.email])

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)


class PasswordChangeView(APIView):
    permission_classes = []

    def post(self, request):
        uidb64 = request.query_params.get("uidb64")
        token = request.query_params.get("token")
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")

        if password != confirm_password:
            return JsonResponse({"status": "error", "message": "비밀번호가 일치하지 않습니다"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = UserModel.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
            return JsonResponse({"status": "error", "message": "비밀번호 재설정에 실패했습니다"}, status=status.HTTP_400_BAD_REQUEST)

        if user is not None and default_token_generator.check_token(user, token):
            user.set_password(password)
            user.save()
            return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({"status": "error", "message": "비밀번호 재설정에 실패했습니다"}, status=status.HTTP_400_BAD_REQUEST)


class SendVerificationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({"status": "error", "message": "로그인이 필요합니다"}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if user.is_email_verified:
            return JsonResponse({"status": "error", "message": "이미 이메일이 인증되었습니다"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate token and store redis ttl 5 minutes
        token = "".join(random.choices(string.ascii_letters + string.digits, k=32))
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        get_redis_connection("default").setex(f"email_verification:{user.pk}", 300, token)

        mail_subject = "Ion 이메일 인증 요청"
        message = render_to_string(
            "email_verification_email.html",
            {
                "user": user,
                "domain": settings.DOMAIN,
                "uid": uid,
                "token": token,
            },
        )
        send_mail(mail_subject, message, f"noreply@{settings.EMAIL_DOMAIN}", [user.email])

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)


class VerifyEmailView(APIView):
    permission_classes = []

    def get(self, request):
        uidb64 = request.query_params.get("uidb64")
        token = request.query_params.get("token")

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = UserModel.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
            return JsonResponse({"status": "error", "message": "이메일 인증에 실패했습니다"}, status=status.HTTP_400_BAD_REQUEST)

        is_token_valid = get_redis_connection("default").get(f"email_verification:{uid}").decode() == token

        if is_token_valid:
            user.is_email_verified = True
            user.save()
            return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({"status": "error", "message": "이메일 인증에 실패했습니다"}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        if not UserModel.objects.get(email=serializer.validated_data["email"]).is_active:
            return JsonResponse(
                {"status": "error", "data": {"message": "비활성화된 계정입니다"}}, status=status.HTTP_401_UNAUTHORIZED
            )

        user = authenticate(
            request, username=serializer.validated_data["email"], password=serializer.validated_data["password"]
        )

        if not user:
            return JsonResponse(
                {"status": "error", "data": {"message": "계정 정보가 일치하지 않습니다"}},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if user.deleted_at:
            return JsonResponse(
                {"status": "error", "data": {"message": "탈퇴한 계정입니다"}}, status=status.HTTP_401_UNAUTHORIZED
            )

        login(request, user)
        return JsonResponse({"status": "success", "data": UserSerializer(user).data}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)


class RegisterView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.create(serializer.validated_data)

        user = authenticate(
            request, username=serializer.validated_data["email"], password=serializer.validated_data["password"]
        )

        if not user:
            return JsonResponse(
                {"status": "error", "message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )

        token = "".join(random.choices(string.ascii_letters + string.digits, k=32))
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        get_redis_connection("default").setex(f"email_verification:{user.pk}", 300, token)

        mail_subject = "Ion 이메일 인증 요청"
        message = render_to_string(
            "email_verification_email.html",
            {
                "user": user,
                "domain": settings.DOMAIN,
                "uid": uid,
                "token": token,
            },
        )
        send_mail(mail_subject, message, f"noreply@{settings.EMAIL_DOMAIN}", [user.email])

        login(request, user)
        return JsonResponse({"status": "success", "data": UserSerializer(user).data}, status=status.HTTP_200_OK)


class CheckView(APIView):
    permission_classes = []

    def get(self, request):
        if request.user.is_authenticated:
            return JsonResponse(
                {"status": "success", "data": UserSerializer(request.user).data}, status=status.HTTP_200_OK
            )
        else:
            return JsonResponse({"status": "error", "message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
