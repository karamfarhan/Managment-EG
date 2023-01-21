from apps.account.models import Account
from django.shortcuts import render
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.generics import UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .email import ActivationEmail, ConfirmationEmail, PasswordChangedConfirmationEmail, PasswordResetEmail
from .serializers import (
    AccountActivationSerializer,
    AccountRedSerializer,
    AccountRegistrationSerializer,
    AccountWriteSerializer,
    ChangePasswordSerializer,
    CheckAccountSerializer,
    LoginTokenObtainSerializer,
    ResetPasswordSerializer,
)
from .utils import account_activation_token, get_user_email


# this is an login view it's return the tokens (you can return any thing else with the tokens from the serializer)
class LoginTokenView(TokenObtainPairView):
    serializer_class = LoginTokenObtainSerializer
    permission_classes = ()
    authentication_classes = ()


@api_view(["GET"])
@permission_classes([])
@authentication_classes([])
def getRouts(request):
    routes = [
        "GET   /account/get_routs/         INFORMATION ABOUT THE AVILABLE ROUTE",
        "GET   /account/view/              RETURN THE DETIAL FOR THE ACCOUNT",
        "GET   /account/check_email/       TO CHECK IF THE ACCOUNT EXCIST",
        "POST  /account/login_token/       TO GET A NEW TOKEN",
        "POST  /account/token/refresh/     TO REFRESH YOUR API TOKEN",
        "POST  /account/register/          REGISTERATION POINT",
        "POST  /account/reset-password/    TO RESET YOUR PASSWORD",
        "PUT   /account/edit/              UPDATE YOUR ACCOUNT DETIAL",
        "PUT   /account/change_password/   CHANGE THE ACCOUNT PASSWORD",
    ]
    return Response(routes)


@api_view(["POST"])
@permission_classes([])
@authentication_classes([])
def registerUser(request):
    if request.method == "POST":
        response_data = {}
        serializer = AccountRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            context = {"user": user}
            to = [get_user_email(user)]
            ActivationEmail(request, context).send(to)
            response_data["response"] = "successfully registered new user."
            response_data["message"] = "We sent a verfication link to your email to and activate your email"
            response_data["email"] = user.email
            response_data["username"] = user.username
            response_data["pk"] = user.pk
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(
    [
        "GET",
    ]
)
def profileUser(request):
    try:
        user = request.user
    except Account.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        serializer = AccountRedSerializer(user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(
    [
        "PUT",
    ]
)
def updateprofileUser(request):
    try:
        user = request.user
    except Account.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == "PUT":
        serializer = AccountWriteSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            account = serializer.save()
            new_serializer = AccountRedSerializer(account, context={"request": request})
            return Response(new_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# http://127.0.0.1:8000/api/check_email/?email=www.karam777krm@gmail.com
@api_view(
    [
        "POST",
    ]
)
@permission_classes([])
@authentication_classes([])
def does_account_exist_view(request):
    if request.method == "POST":
        response_data = {}
        serializer = CheckAccountSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            if email:
                response_data["email"] = request.data["email"]
                response_data["is_exists"] = True
                response_status = status.HTTP_200_OK
            else:
                response_data["response_msg"] = "There is no Account with this email"
                response_data["is_exists"] = False
                response_status = status.HTTP_404_NOT_FOUND
        return Response(response_data, status=response_status)


class ChangePasswordView(UpdateAPIView):

    serializer_class = ChangePasswordSerializer
    model = Account
    # permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        response_data = {}
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                response_data["response_msg"] = "Wrong password, Enter your current Password correctly"
                response_status = status.HTTP_400_BAD_REQUEST
                return Response(response_data, response_status)

            # confirm the new passwords match
            new_password = serializer.data.get("new_password")
            confirm_new_password = serializer.data.get("confirm_new_password")
            if new_password != confirm_new_password:
                response_data["response_msg"] = "New passwords must match"
                response_status = status.HTTP_400_BAD_REQUEST
                return Response(response_data, response_status)
            if self.object.check_password(new_password):
                response_data["response_msg"] = "You can not put the same previous password"
                response_status = status.HTTP_400_BAD_REQUEST
                return Response(response_data, response_status)

            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            context = {"user": self.request.user}
            to = [get_user_email(self.request.user)]
            PasswordChangedConfirmationEmail(self.request, context).send(to)
            response_data["response_msg"] = "successfully changed password"
            response_status = status.HTTP_200_OK
            return Response(response_data, response_status)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def account_activate(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = Account.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, user.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return render(request, "account/registeration/activation_succed.html")
    return render(request, "account/registeration/activation_invalid.html")


def get_redirect_if_exists(request):
    redirect = None
    if request.GET:
        if request.GET.get("next"):
            redirect = str(request.GET.get("next"))
    return redirect


@api_view(
    [
        "POST",
    ]
)
@permission_classes([])
@authentication_classes([])
def ResetPasswordView(request):
    if request.method == "POST":
        response_data = {}
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            if user:
                # send_reset_email(request, user)
                context = {"user": user}
                to = [get_user_email(user)]
                PasswordResetEmail(request, context).send(to)
                response_data["response"] = "password reset link has been sent"
        else:
            response_data = serializer.errors
        return Response(response_data)


class UserActivationView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, *args, **kwargs):
        response_date = {}
        serializer = AccountActivationSerializer(data={"uid": self.kwargs["uidb46"], "token": self.kwargs["token"]})
        if serializer.is_valid():
            user = serializer.validated_data
            send_email = True
            if not user.email_verified:
                send_email = True
            user.is_active = True
            user.email_verified = True
            user.save()

            if send_email:
                context = {"user": user}
                to = [get_user_email(user)]
                ConfirmationEmail(self.request, context).send(to)

            response_date["response"] = "The Account has been verified successfully, now go and login"
            return render(request, "email/account_activation_message.html", response_date)
        else:
            response_date["response"] = serializer.errors["non_field_errors"][0]
            return render(request, "email/account_activation_message.html", response_date)


@api_view(["POST"])
@permission_classes([])
@authentication_classes([])
def activate_for_testing(request):
    if request.method == "POST":
        account = Account.objects.get(email=request.data["email"])
        account.is_active = True
        account.email_verified = True
        account.save()
        return Response({"message": "activation success"}, status=status.HTTP_201_CREATED)
    return Response({"message": " activation failed"}, status=status.HTTP_400_BAD_REQUEST)
