import graphene
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from graphene_django import DjangoObjectType
from graphene_django.rest_framework.mutation import SerializerMutation


class PermissionType(DjangoObjectType):
    class Meta:
        model = Permission
        fiedls = ["name", "codename"]


class GroupType(DjangoObjectType):
    class Meta:
        model = Group
        fields = ["name", "permissions"]


class AccountType(DjangoObjectType):
    groups = graphene.List(GroupType)
    user_permissions = graphene.List(PermissionType)
    all_permissions = graphene.List(graphene.String)

    class Meta:
        model = get_user_model()
        fields = [
            "id",
            "email",
            "username",
            "profile_image",
            "hide_email",
            "first_name",
            "last_name",
            "employee",
        ]

    def resolve_groups(self, info):
        return self.groups.all()

    def resolve_user_permissions(self, info):
        return self.user_permissions.all()

    def resolve_all_permissions(self, info):
        user_permissions = [p.codename for p in self.user_permissions.all()]
        group_permissions = [p.codename for group in self.groups.all() for p in group.permissions.all()]
        return list(set(user_permissions).union(set(group_permissions)))
