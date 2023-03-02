import graphene
from apps.account import schema as account_schema
from apps.substance import schema as substance_schema


class Query(
    account_schema.Query,
    substance_schema.Query,
    graphene.ObjectType,
):
    pass


class Mutation(
    account_schema.Mutation,
    substance_schema.Mutation,
    graphene.ObjectType,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
