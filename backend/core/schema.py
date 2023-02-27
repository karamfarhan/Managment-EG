import graphene

# import graphql_jwt


class TestQuery(graphene.ObjectType):
    hello = graphene.String(default_value="Hi!")


class Query(
    TestQuery,
    graphene.ObjectType,
):
    pass


# class Mutation(
#     # users.schema.Mutation,
#     # links.schema.Mutation,
#     # links.schema_relay.RelayMutation,
#     graphene.ObjectType,
# ):

#     # token_auth = graphql_jwt.ObtainJSONWebToken.Field()
#     # verify_token = graphql_jwt.Verify.Field()
#     # refresh_token = graphql_jwt.Refresh.Field()
#     pass

schema = graphene.Schema(query=Query)
