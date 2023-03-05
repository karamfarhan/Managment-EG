import graphene
from apps.account import schema as account_schema
from apps.car import schema as car_shcema
from apps.employee import schema as employee_schema
from apps.store import schema as store_schema
from apps.substance import schema as substance_schema


class Query(
    account_schema.Query,
    substance_schema.Query,
    employee_schema.Query,
    store_schema.Query,
    car_shcema.Query,
    graphene.ObjectType,
):
    pass


class Mutation(
    account_schema.Mutation,
    substance_schema.Mutation,
    employee_schema.Mutation,
    store_schema.Mutation,
    car_shcema.Mutation,
    graphene.ObjectType,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
