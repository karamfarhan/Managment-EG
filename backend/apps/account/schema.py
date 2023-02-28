import graphene
import graphql_jwt

# from graphql_jwt.refresh_token.shortcuts import get_refresh_token
# from graphql_jwt.shortcuts import get_user_by_token,get_user_by_payload
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from graphene_django import DjangoObjectType
from graphql_jwt import JSONWebTokenMutation, Refresh
from graphql_jwt.decorators import login_required, permission_required


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


class ObtainJSONWebToken(JSONWebTokenMutation):
    user = graphene.Field(AccountType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user)


# TODO: i have to figure out how to send the user with in the refresh token
# class CustomeRefresh(Refresh):
#     user = graphene.Field(AccountType)

#     @classmethod
#     def resolve(cls, root, info, **kwargs):
#         return cls(user=info.context.user)


# class CreateUser(graphene.Mutation):
#     user = graphene.Field(AccountType)

#     class Arguments:
#         username = graphene.String(required=True)
#         password = graphene.String(required=True)
#         email = graphene.String(required=True)

#     def mutate(self, info, username, password, email):
#         user = get_user_model()(
#             username=username,
#             email=email,
#         )
#         user.set_password(password)
#         user.save()

#         return CreateUser(user=user)


class Mutation(graphene.ObjectType):
    # create_user = CreateUser.Field()
    token_auth = ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


class Query(graphene.ObjectType):
    me = graphene.Field(AccountType)
    user_by_username = graphene.Field(AccountType, username=graphene.String(required=True))

    @login_required
    @permission_required(["account.view_account"])
    def resolve_me(self, info, **kwargs):
        user = info.context.user
        # this is the same as @login_required
        # if user.is_anonymous:
        #     raise Exception("Not logged!")
        return user

    @login_required
    @permission_required(["account.view_account"])
    def resolve_user_by_username(self, info, username, **kwargs):
        if not username:
            raise Exception("Can't be empty, provide username to search")
        return get_user_model().objects.get(username=username)
