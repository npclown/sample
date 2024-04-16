from django.urls import include, path

from .views import (
    CheckView,
    LoginView,
    LogoutView,
    PasswordChangeView,
    RegisterView,
    ResetPasswordView,
    SendVerificationView,
    VerifyEmailView,
)

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/check/", CheckView.as_view(), name="check"),
    path("auth/send-verification/", SendVerificationView.as_view(), name="send-verification"),
    path("auth/verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path("auth/reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("auth/change-password/", PasswordChangeView.as_view(), name="change-password"),
    path("admin/", include("emailuser.admin.urls")),
]
