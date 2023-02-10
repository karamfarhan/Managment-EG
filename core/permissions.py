import copy

from rest_framework.permissions import SAFE_METHODS, BasePermission, DjangoModelPermissions


class CustomDjangoModelPermission(DjangoModelPermissions):
    def __init__(self):
        self.perms_map = copy.deepcopy(self.perms_map)  # from EunChong's answer
        self.perms_map["GET"] = ["%(app_label)s.view_%(model_name)s"]


# class UserStoresOnlyPermission(BasePermission):
#     message = "Getting stores for the users that related to it"
#     def has_object_permission(self, request, view, obj):
#         if request.method in SAFE_METHODS:
#             employee = getattr(request.user,"employee", None):
#             if employee:

#             return
#         return super().has_object_permission(request, view, obj)
