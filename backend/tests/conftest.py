#     )
### using factoryboy and Fakerlibrary to make it more effiecent
# first we should make the factories - go to factories.py file
# then we will register them here
from pytest_factoryboy import register
from tests.factories import AccountFactory, CategoryFactory, SubstanceFactory

register(AccountFactory)
register(CategoryFactory)
register(SubstanceFactory)
# we can build the fixture here like this under
# or if you want you can build it inside the test
# @pytest.fixture
# def account(db, account_factory):
#     account = account_factory.create()
#     return account
