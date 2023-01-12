from apps.account.models import Account
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ObjectDoesNotExist
from django.core.validators import MinLengthValidator
from django.db.models import Q
from drf_extra_fields.fields import LowercaseEmailField
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .utils import decode_uid

# from rest_framework_simplejwt.serializers import UniqueValidator, LowercaseEmailField


class LoginTokenObtainSerializer(TokenObtainPairSerializer):
    # to add the fields inside the access token and hash it
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims

        # token['username'] = user.username

        # Add more custom fields from your custom user model, If you have a
        # custom user model.
        # ...
        return token

    def validate(self, account):
        email = account["email"].lower()
        password = account["password"]

        # Check if the Account model has an email field
        if not hasattr(Account, "email"):
            raise ValidationError("The Account model does not have an email field")

        account_exists = Account.objects.filter(email=email).exists()
        if account_exists:
            user = authenticate(email=email, password=password)
            if user:
                if user.is_active:
                    data = super().validate(account)
                    data["username"] = user.username
                    return data
                else:
                    raise AuthenticationFailed(
                        "The Account Is not Acitve, Contact the Admin to Activate your Account."
                    )
            else:
                raise AuthenticationFailed("The Password Is Incorect.")
        else:
            raise AuthenticationFailed("Invalid credentials, Email or Password is Incorect")


# class UserRegistrationSerializer(serializers.Serializer):
#     email = serializers.EmailField(required=True, label="Email Address")
#     username = serializers.CharField(required=True, max_length=200)
#     password = serializers.CharField(required=True, label="Password", style={"input_type": "password"})
#     confirm_password = serializers.CharField(
#         required=True,
#         label="Confirm Password",
#         style={"input_type": "password"},
#     )

#     def validate_confirm_password(self, value):
#         data = self.get_initial()
#         password = data.get("password")
#         if password != value:
#             raise serializers.ValidationError("Passwords doesn't match.")
#         return value

#     def validate_email(self, value):
#         if Account.objects.filter(email=value.lower()).exists():
#             raise serializers.ValidationError("Email already exists.")
#         return value

#     def validate_username(self, value):
#         if Account.objects.filter(username=value).exists():
#             raise serializers.ValidationError("Username already exists.")
#         return value

#     def validate_password(self, value):
#         if len(value) < 8:
#             raise serializers.ValidationError("Password should be atleast 8 characters long.")
#         return value

#     def save(self):
#         username = self.validated_data["username"]
#         email = self.validated_data["email"].lower()
#         password = self.validated_data["password"]
#         account = Account(
#             username=username,
#             email=email,
#         )
#         account.set_password(password)
#         account.is_active = False
#         account.save()
#         return account

## AI code


class AccountRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField(
        required=True, label="Email Address", validators=[UniqueValidator(queryset=Account.objects.all())]
    )
    username = serializers.CharField(
        required=True, max_length=200, validators=[UniqueValidator(queryset=Account.objects.all())]
    )
    password = serializers.CharField(
        required=True, label="Password", style={"input_type": "password"}, validators=[MinLengthValidator(8)]
    )
    confirm_password = serializers.CharField(
        required=True,
        label="Confirm Password",
        style={"input_type": "password"},
    )

    def validate_confirm_password(self, value):
        data = self.get_initial()
        password = data.get("password")
        if password != value:
            raise serializers.ValidationError("Passwords don't match.")
        return value

    def save(self):
        username = self.validated_data["username"]
        email = self.validated_data["email"].lower()
        password = self.validated_data["password"]
        account = Account(
            username=username,
            email=email,
        )
        account.set_password(password)
        account.is_active = False
        account.save()
        return account


class AccountRedSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField("validate_profile_image")

    class Meta:
        model = Account
        fields = [
            "pk",
            "email",
            "username",
            "profile_image",
            "hide_email",
            "first_name",
            "last_name",
        ]
        read_only_fields = fields

    def validate_profile_image(self, user):
        try:
            request = self.context["request"]
        except KeyError:
            raise ValueError("'request' is not defined in 'self.context'")
        try:
            profile_image = user.profile_image.url
        except AttributeError:
            raise ValueError("'user.profile_image' is not defined or does not have a 'url' attribute")
        full_url = request.build_absolute_uri(profile_image)
        if full_url is None:
            raise ValueError("'request.build_absolute_uri()' returned 'None'")
        if "?" in full_url:
            profile_image = full_url[: full_url.rfind("?")]
        else:
            profile_image = full_url
        return profile_image


# class AccountWriteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Account
#         fields = [
#             "email",
#             "username",
#             "profile_image",
#             "hide_email",
#             "first_name",
#             "last_name",
#         ]

#     def validate_email(self, value):
#         if Account.objects.exclude(pk=self.instance.pk).filter(email=value.lower()).exists():
#             raise serializers.ValidationError({"response": "account with this email already exists."})
#         return value

#     def validate_username(self, value):
#         if Account.objects.exclude(pk=self.instance.pk).filter(username=value).exists():
#             raise serializers.ValidationError({"response": "account with this or username already exists."})
#         return value

#     def update(self, instance, validated_data):
#         print(validated_data)
#         instance.email = validated_data.get("email", instance.email).lower()
#         instance.username = validated_data.get("username", instance.username)
#         instance.profile_image = validated_data.get("profile_image", instance.profile_image)
#         instance.hide_email = validated_data.get("hide_email", instance.hide_email)
#         instance.first_name = validated_data.get("first_name", instance.first_name)
#         instance.last_name = validated_data.get("last_name", instance.last_name)
#         instance.save(update_fields=["email", "username", "profile_image", "hide_email", "first_name", "last_name"])
#         return instance


## AI code
class AccountWriteSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[UniqueValidator(queryset=Account.objects.all())], required=True)
    username = serializers.CharField(validators=[UniqueValidator(queryset=Account.objects.all())], required=True)

    class Meta:
        model = Account
        fields = [
            "email",
            "username",
            "profile_image",
            "hide_email",
            "first_name",
            "last_name",
        ]

    def update(self, instance, validated_data):
        print(validated_data)
        instance.email = validated_data.get("email", instance.email).lower()
        instance.username = validated_data.get("username", instance.username)
        instance.profile_image = validated_data.get("profile_image", instance.profile_image)
        instance.hide_email = validated_data.get("hide_email", instance.hide_email)
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.save(update_fields=["email", "username", "profile_image", "hide_email", "first_name", "last_name"])
        return instance


class ChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)


# class ResetPasswordSerializer(serializers.Serializer):
#     email = serializers.EmailField(
#         required=False,
#         allow_blank=True,
#         write_only=True,
#         label="Email Address",
#     )
#     username = serializers.CharField(
#         required=False,
#         allow_blank=True,
#         write_only=True,
#     )

#     def validate(self, data):
#         email = data.get("email", None)
#         username = data.get("username", None)

#         if not email and not username:
#             raise serializers.ValidationError("Please enter username or email to reset your password.")

#         user = (
#             Account.objects.filter(Q(email=email) | Q(username=username))
#             .exclude(email__isnull=True)
#             .exclude(email__iexact="")
#             .distinct()
#         )

#         if user.exists() and user.count() == 1:
#             user_obj = user.first()
#         else:
#             raise serializers.ValidationError("we can't find any accout with this email or username")

#         if user_obj.is_active:
#             data["user"] = user_obj
#         else:
#             raise serializers.ValidationError("User not active.")
#         return data

## Ai code


class ResetPasswordSerializer(serializers.Serializer):
    email = LowercaseEmailField(
        required=False,
        allow_blank=True,
        write_only=True,
        label="Email Address",
        # validators=[UniqueValidator(queryset=Account.objects.all(), message="Email already exists.")],
    )
    username = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
        # validators=[UniqueValidator(queryset=Account.objects.all(), message="Username already exists.")],
    )

    def validate(self, data):
        email = data.get("email", None)
        username = data.get("username", None)

        if not email and not username:
            raise serializers.ValidationError("Please enter username or email to reset your password.")

        try:
            user = Account.objects.get(Q(email=email) | Q(username=username))
        except ObjectDoesNotExist:
            raise serializers.ValidationError("we can't find any accout with this email or username")

        if user.is_active:
            data["user"] = user
        else:
            raise serializers.ValidationError("User not active.")
        return data


class AccountActivationSerializer(serializers.Serializer):
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)

    def validate(self, attrs):
        validated_data = super().validate(attrs)

        # check the user for this uid is available or not in DB
        try:
            uid = decode_uid(self.initial_data.get("uid", ""))
            user = Account.objects.get(pk=uid)
        except (Account.DoesNotExist, ValueError, TypeError, OverflowError):
            raise serializers.ValidationError("we can't find any user with this token-uid")

        if user.is_active and user.email_verified:
            raise serializers.ValidationError("The account is active")
        # if user is not None:
        is_token_valid = default_token_generator.check_token(user, validated_data["token"])

        if is_token_valid:
            return user
        else:
            raise serializers.ValidationError("activation token is not valid or your link is expired! request new one")


## AI code

# from uuid import UUID
# class AccountActivationSerializer(serializers.Serializer):
#     uid = serializers.CharField(required=True)
#     token = serializers.CharField(required=True)

#     def validate(self, attrs):
#         validated_data = super().validate(attrs)

#         # check the user for this uid is available or not in DB
#         try:
#             uid = decode_uid(self.initial_data.get("uid", ""))
#             user = Account.objects.get(pk=uid)
#         except (ValueError, TypeError, OverflowError):
#             return {
#                 "error": "we can't find any user with this token-uid",
#                 "status_code": 404
#             }
#         finally:
#             # Close any open resources
#             pass

#         if user.is_active and user.email_verified:
#             return {
#                 "error": "account is active",
#                 "status_code": 400
#             }
#         if user is not None:
#             # if user.is_active and user.email_verified:
#             #     raise serializers.ValidationError("account is active")
#             is_token_valid = default_token_generator.check_token(user, validated_data["token"])

#         if is_token_valid:
#             return user
#         else:
#             return {
#                 "error": "activation token is not valid or your link is expired! request new one",
#                 "status_code": 400
#             }


# --> checkUsername serializer
class CheckAccountSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=50)

    def validate_email(self, value):
        account_exists = Account.objects.filter(email=value).exists()
        return account_exists
