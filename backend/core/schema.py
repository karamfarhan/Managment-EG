import graphene
from apps.account import schema as account_schema


class TestQuery(graphene.ObjectType):
    hello = graphene.String(default_value="Hi!")


class Query(
    TestQuery,
    account_schema.Query,
    graphene.ObjectType,
):
    pass


class Mutation(
    account_schema.Mutation,
    graphene.ObjectType,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
