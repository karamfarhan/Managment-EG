import uuid

from apps.employee.models import Employee
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from PIL import Image

from .managers import MyAccountManager
from .utils import get_default_profile_image, get_profile_image_filepath

# from .utils import EmailThread


class Account(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    email = models.EmailField(verbose_name="email address", max_length=60, unique=True)
    username = models.CharField(max_length=30, unique=True)
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    date_joined = models.DateTimeField(verbose_name="date joined", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="last update", auto_now=True)

    is_active = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    employee = models.OneToOneField(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="account",
    )
    # is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    hide_email = models.BooleanField(default=True)
    profile_image = models.ImageField(
        max_length=255,
        upload_to=get_profile_image_filepath,
        null=True,
        blank=True,
        default=get_default_profile_image,
    )
    objects = MyAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "username",
    ]

    class Meta:
        verbose_name = "Accounts"
        verbose_name_plural = "Accounts"

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        img = Image.open(self.profile_image.path)

        if img.height > 500 or img.width > 500:
            output_size = (500, 500)
            img.thumbnail(output_size)
            img.save(self.profile_image.path)

    # def email_user(self, subject, message):
    #     email = EmailMessage(
    #         subject=subject,
    #         body=message,
    #         from_email=settings.EMAIL_HOST_USER,
    #         to=[self.email],
    #     )

    #     EmailThread(email).start()

    def get_profile_image_filename(self):
        return str(self.profile_image)[str(self.profile_image).index(f"profile_images/{str(self.pk)}/") :]

    # For checking permissions. to keep it simple all admin have ALL permissons
    # def has_perm(self, perm, obj=None):
    #     return self.is_admin

    # Does this user have permission to view this app? (ALWAYS YES FOR SIMPLICITY)
    # def has_module_perms(self, app_label):
    #     return True
