import graphene
import graphql_jwt

# from .utils import get_user_email
# from graphql_jwt.utils import get_user_by_payload, get_payload
from django.contrib.auth import get_user_model

# import graphql
# from graphql_jwt.refresh_token.shortcuts import get_refresh_token
# from graphql_jwt.shortcuts import get_user_by_token,get_user_by_payload
# from django.contrib.auth import get_user_model, authenticate
# from django.contrib.auth.models import Group, Permission
from django.http import Http404

# from graphene import relay
# from graphene_django import DjangoObjectType
from graphene_django.rest_framework.mutation import SerializerMutation
from graphql_jwt import exceptions

# from graphene_django.types import ErrorType
# from graphql_jwt import JSONWebTokenMutation, Refresh
from graphql_jwt.decorators import login_required, permission_required

# from .email import ActivationEmail, ConfirmationEmail, PasswordChangedConfirmationEmail, PasswordResetEmail
from .graph_types import AccountType
from .models import Account
from .serializers import AccountRegistrationSerializer, AccountWriteSerializer, ChangePasswordSerializer


class ObtainJSONWebToken(graphql_jwt.relay.JSONWebTokenMutation):
    user = graphene.Field(AccountType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        user = info.context.user
        if not user.is_active:
            raise exceptions.JSONWebTokenError("The Account Is not Active, We sent an Activation Link to your Email.")
        return cls(user=user)


# TODO: I have to figure out how to write a custom refresh class mutation so that i can return the user too
# class CustomRefresh(graphql_jwt.relay.Refresh):
#     user = graphene.Field(AccountType)
#
#     @classmethod
#     def resolve(cls, root, info, **kwargs):
#         user = info.context.user
#         return cls(user=user)


class CreateAccountMutation(SerializerMutation):
    class Meta:
        serializer_class = AccountRegistrationSerializer
        model_operations = [
            "create",
        ]


class UpdateAccountMutation(SerializerMutation):
    class Meta:
        serializer_class = AccountWriteSerializer
        model_class = Account
        model_operations = [
            "update",
        ]

    @classmethod
    def get_serializer_kwargs(cls, root, info, **input):
        account = info.context.user
        if account:
            return {"instance": account, "data": input, "partial": True}
        raise Http404


# ! change password with serializerMutation
class ChangePasswordMutation(SerializerMutation):
    class Meta:
        serializer_class = ChangePasswordSerializer
        model_operations = [
            "update",
        ]


class Mutation(graphene.ObjectType):
    create_account = CreateAccountMutation.Field()
    update_account = UpdateAccountMutation.Field()
    change_password = ChangePasswordMutation.Field()
    token_auth = ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.relay.Verify.Field()
    refresh_token = graphql_jwt.relay.Refresh.Field()


class Query(graphene.ObjectType):
    me = graphene.Field(AccountType)
    user_by_username = graphene.Field(AccountType, username=graphene.String(required=True))

    @login_required
    @permission_required(["account.view_account"])
    def resolve_me(self, info, **kwargs):
        user = info.context.user
        return user

    @login_required
    @permission_required(["account.view_account"])
    def resolve_user_by_username(self, info, username, **kwargs):
        if not username:
            raise Exception("Can't be empty, provide username to search")
        return get_user_model().objects.get(username=username)


# ! change password with Pure code
# class ChangePasswordMutation(graphene.Mutation):
#     class Arguments:
#         # The input arguments for this mutation
#         old_password = graphene.String(required=True)
#         new_password = graphene.String(required=True)
#         confirm_new_password = graphene.String(required=True)

#     #The class attributes define the response of the mutation
#     errors = graphene.List(
#         ErrorType, description="May contain more than one error for same field."
#     )
#     success = graphene.Boolean(default_value=False)

#     # ! 400 ms
#     # @classmethod
#     # def mutate(cls,root, info, old_password, new_password,confirm_new_password):
#     #     is_valid,error_messages = cls.is_valid(info, old_password, new_password,confirm_new_password)
#     #     if is_valid:
#     #         account = info.context.user
#     #         account.set_password(new_password)
#     #         account.save()
#     #         # request = info.context
#     #         # context = {"user": account}
#     #         # to = [get_user_email(account)]
#     #         # PasswordChangedConfirmationEmail(request, context).send(to)
#     #         return cls(errors=None,success=True)
#     #     else:
#     #         errors = ErrorType.from_errors(error_messages)
#     #         success = False
#     #         return cls(errors=errors,success=success)
#     # @classmethod
#     # def is_valid(cls, info, old_password, new_password,confirm_new_password):
#     #     account = info.context.user
#     #     error_messages: dict = {}
#     #     if not account.check_password(old_password):
#     #         error_messages = {'old_password': ['Wrong password, Enter your current Password correctly']}

#     #     if new_password != confirm_new_password:
#     #         error_messages = {'new_password': ['New passwords must match']}

#     #     if account.check_password(new_password):
#     #         error_messages = {'new_password': ['You can not put the same previous password']}

#     #     if not error_messages:
#     #         return True, error_messages
#     #     return False, error_messages

#     #! 200 ms
#     @classmethod
#     def mutate(cls, root, info, old_password, new_password,confirm_new_password):
#         account = info.context.user
#         if not account.check_password(old_password):
#             raise Exception('Wrong password, Enter your current Password correctly')

#         if new_password != confirm_new_password:
#             raise Exception('New passwords must match')

#         if account.check_password(new_password):
#             raise Exception('You can not put the same previous password')

#         account = info.context.user
#         account.set_password(new_password)
#         account.save()
#         request = info.context
#         context = {"user": account}
#         to = [get_user_email(account)]
#         PasswordChangedConfirmationEmail(request, context).send(to)
#         success = True
#         return cls(success=success)
