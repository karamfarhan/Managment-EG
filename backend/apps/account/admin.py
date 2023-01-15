from apps.account.forms import RegistrationForm, UpdateAccountForm
from apps.account.models import Account
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from rest_framework_simplejwt.token_blacklist.admin import BlacklistedTokenAdmin, OutstandingTokenAdmin
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken


@admin.register(Account)
class AccountAdmin(UserAdmin):
    list_display = (
        "email",
        "username",
        "date_joined",
        "last_login",
        "employee_info",
        "is_superuser",
        "is_staff",
        "is_active",
    )
    search_fields = (
        "email",
        "username",
    )
    readonly_fields = ("id", "updated_at", "date_joined", "last_login")

    ordering = ("-date_joined", "last_login", "username", "email")

    filter_horizontal = ()
    list_filter = (
        "is_staff",
        "is_superuser",
        "is_active",
    )

    fieldsets = (
        (None, {"fields": ("email", "username")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_staff",
                    "is_superuser",
                    "is_active",
                    "email_verified",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Personal", {"fields": ("hide_email", "employee_info", "updated_at", "date_joined", "last_login")}),
    )

    # formfield_overrides = {
    # 	Account.email : {'widget' : Textarea(attrs={'rows':10, 'cols':40})}
    # }

    add_fieldsets = (
        (None, {"fields": ("email", "username", "password1", "password2")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_staff",
                    "is_superuser",
                    "is_active",
                    "email_verified",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Personal", {"fields": ("hide_email", "employee_info")}),
    )

    form = UpdateAccountForm
    add_form = RegistrationForm

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        is_superuser = request.user.is_superuser

        if not is_superuser:
            form.base_fields["email"].disabled = True
            form.base_fields["is_active"].disabled = True
            form.base_fields["email_verified"].disabled = True
            form.base_fields["is_superuser"].disabled = True
            form.base_fields["user_permissions"].disabled = True
            form.base_fields["groups"].disabled = True
            form.base_fields["employee_info"].disabled = True
        return form

    # def add_fields_for_superusers(self, request, fieldsets):
    #     # Only add fields for superusers
    #     if request.user.is_superuser:
    #         for fieldset in fieldsets:
    #             # Find the index of the 'Permissions' fieldset in the list of fieldsets
    #             if fieldset[0] == "Permissions":
    #                 # Add the 'is_superuser', 'groups', and 'user_permissions' fields
    #                 fieldset[1]['fields'] += ('is_superuser', 'groups', 'user_permissions')
    #                 break
    #     return fieldsets

    # def get_fieldsets(self, request, obj=None):
    #     fieldsets = super().get_fieldsets(request, obj)
    #     fieldsets = self.add_fields_for_superusers(request, fieldsets)
    #     return fieldsets


## to override the permissions mixin e.g return True in a sertian time or like that
## or to add more checks on the user not just if he have the permission
class ReadOnlyAdminMixin:
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        # here you can put any additional checks like time or else
        # and then return the super.()
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_view_permission(self, request, obj=None):
        return False


## or if you don't like the above method , i think you can change the permission method
## directly from the model admin class and add your check there

# @admin.register(Product)
# class ProductAdmin(ReadOnlyAdminMixin, admin.ModelAdmin):
#     list_display = ("name", )

#     def get_form(self, request, obj=None, **kwargs):
#         form = super().get_form(request, obj, **kwargs)
#         is_superuser = request.user.is_superuser

#         if not is_superuser:
#             form.base_fields['name'].disabled = True
#         return form


# admin.site.unregister(OutstandingToken)
# admin.site.unregister(BlacklistedToken)

# @admin.register(OutstandingToken)
# class CustomOutstandingTokenAdmin(OutstandingTokenAdmin):
#     pass

# @admin.register(BlacklistedToken)
# class CustomBlacklistedTokenAdmin(BlacklistedTokenAdmin):
#     pass
