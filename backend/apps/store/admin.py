from django.contrib import admin

# Register your models here.
from .models import Image, MediaPack, Store

admin.site.register(Store)
admin.site.register(Image)
admin.site.register(MediaPack)

# from django.utils.html import format_html

# @admin.register(Media)
# class MediaAdmin(admin.ModelAdmin):
#     list_display = ("store","alt_text","created_at","created_by","image_tag")
#     def image_tag(self, obj):
#         return format_html('<img src="{}" width="150" height="150"/>'.format(obj.img_url.url))

#     image_tag.short_description = 'Image'

#     def image_tag_big(self, obj):
#         return format_html('<img src="{}" width="300" height="250"/>'.format(obj.img_url.url))

#     image_tag_big.short_description = 'Image'
#     # search_fields = (
#     #     "email",
#     #     "username",
#     # )

#     # ordering = ("-date_joined", "last_login", "username", "email")

#     # filter_horizontal = ()
#     # list_filter = (
#     #     "is_staff",
#     #     "is_superuser",
#     #     "is_active",
#     # )

#     fields = ("store","alt_text","created_by","created_at","img_url","image_tag_big")
#     readonly_fields = ("id", "created_at","image_tag_big")

#     # formfield_overrides = {
#     # 	Account.email : {'widget' : Textarea(attrs={'rows':10, 'cols':40})}
#     # }

#     # add_fieldsets = (
#     #     (None, {"fields": ("email", "username", "password1", "password2")}),
#     #     (
#     #         "Permissions",
#     #         {
#     #             "fields": (
#     #                 "is_staff",
#     #                 "is_superuser",
#     #                 "is_active",
#     #                 "email_verified",
#     #                 "groups",
#     #                 "user_permissions",
#     #             )
#     #         },
#     #     ),
#     #     ("Personal", {"fields": ("hide_email",)}),
#     # )

#     # form = UpdateAccountForm
#     # add_form = RegistrationForm

#     # def get_form(self, request, obj=None, **kwargs):
#     #     form = super().get_form(request, obj, **kwargs)
#     #     is_superuser = request.user.is_superuser

#     #     if not is_superuser:
#     #         form.base_fields["email"].disabled = True
#     #         form.base_fields["is_active"].disabled = True
#     #         form.base_fields["email_verified"].disabled = True
#     #         form.base_fields["is_superuser"].disabled = True
#     #         form.base_fields["user_permissions"].disabled = True
#     #         form.base_fields["groups"].disabled = True
#     #     return form
