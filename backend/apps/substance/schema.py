import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.rest_framework.mutation import SerializerMutation
from graphql_jwt.decorators import login_required, permission_required

from .filters import SubstanceFilter
from .models import Category, Instrument, Substance
from .serializers import CategorySerializer, SubstanceSerializer


class CategoryNode(DjangoObjectType):
    class Meta:
        model = Category
        name = "Category"
        filter_fields = ("name",)
        interfaces = (relay.Node,)

    @classmethod
    @login_required
    @permission_required("substance.view_category")
    def get_queryset(cls, queryset, info):
        return queryset


class SubstanceNode(DjangoObjectType):
    class Meta:
        model = Substance
        name = "Substance"
        filterset_class = SubstanceFilter
        interfaces = (relay.Node,)

    # ! this method is for the single get request when you request by id
    # ! maybe i want the single request to not have permission,or not authenticate
    # @classmethod
    # @login_required
    # def get_node(cls, info, id):
    #     return super(SubstanceNode,cls).get_node(info ,id)

    # ! to customize the query based on the user, and set a permissions for it
    @classmethod
    @login_required
    @permission_required("substance.view_substance")
    def get_queryset(cls, queryset, info):
        # TODO: here i can send only the data that belongs to the user
        return queryset


class CategoryMutation(SerializerMutation):
    class Meta:
        serializer_class = CategorySerializer
        model_operations = [
            "create",
        ]
        lookup_field = "name"


# TODO: make substance mutaion to accept setting category relationships
# *: there is a problem with Substance mutaion, it set the category relationship
# *: as a string while it should be a categoryNode or list of id, types, and i dont' know how to change it to what i need
# *: one way is to change the set the category filed on the serializer to serializers.ListField
# *: it will work but, i have to set it write_only=True in order to work,in result it will not return the categories when query for the substance since it's write_only
# *: and also it will not give a good error message when i send wrong category pk


class SubstanceMutation(SerializerMutation):
    class Meta:
        serializer_class = SubstanceSerializer
        model_operations = ["create", "update"]
        lookup_field = "id"
        # exclude_fields = ('category',)
        convert_choices_to_enum = False


class Mutation(graphene.ObjectType):
    write_substance = SubstanceMutation.Field()
    write_category = CategoryMutation.Field()


class Query(graphene.ObjectType):
    substance = relay.Node.Field(SubstanceNode)
    substances = DjangoFilterConnectionField(SubstanceNode)
    categories = DjangoFilterConnectionField(CategoryNode)
