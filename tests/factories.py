import factory
from faker import Faker

from apps.account.models import Account
from apps.substance.models import Category, Substance

fake = Faker()


class AccountFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Account

    username: str = "testuser"
    email: str = "test@example.com"
    first_name: str = "firstname"
    last_name: str = "lastname"
    is_staff: bool = False
    is_superuser: bool = False
    is_active: bool = True
    email_verified: bool = True
    hide_email: bool = False
    password: str = factory.PostGenerationMethodCall("set_password", "testpass")


class CategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Category

    name: str = "test-category"


class SubstanceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Substance

    name = factory.Faker("name")
    category = factory.SubFactory(CategoryFactory)
    created_by = factory.SubFactory(AccountFactory)
    description = factory.Faker("text")
    is_available = True
    units = 100
    unit_type = "KL"
