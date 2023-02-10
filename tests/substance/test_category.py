import pytest

# from django.test import Client
from rest_framework.test import APIClient

from apps.account.models import Account
from apps.substance.models import Category, Substance

client = APIClient()


@pytest.mark.django_db
def test_create_category(account_factory):
    # Create an account
    account = account_factory.create()
    login_response = client.post("/account/login_token/", data={"email": account.email, "password": "testpass"})
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")

    category_data = {
        "name": "test-category",
    }
    response = client.post("/categories/", data=category_data)
    assert response.status_code == 201
    assert response.data["name"] == category_data["name"]


@pytest.mark.parametrize(
    "name, validity",
    [
        ("new-category", 201),
        ("test-category", 400),
    ],
)
@pytest.mark.django_db
def test_create_category_with_exsisting_name(account_factory, category_factory, name: str, validity: int):
    # Create an account
    account = account_factory.create()
    category_factory.create()

    login_response = client.post("/account/login_token/", data={"email": account.email, "password": "testpass"})
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")

    category_data = {
        "name": name,
    }
    response = client.post("/categories/", data=category_data)
    assert response.status_code == validity


@pytest.mark.django_db
def test_delete_category(account_factory, category_factory):
    # Create an account
    account = account_factory.create()
    substance_category = category_factory.create()
    login_response = client.post("/account/login_token/", data={"email": account.email, "password": "testpass"})
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")
    response = client.delete(f"/categories/{substance_category.name}/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_get_list_category(account_factory, category_factory):
    # Create an account
    account = account_factory.create()
    category_factory.create()
    category_factory.create(name="new-category")
    login_response = client.post("/account/login_token/", data={"email": account.email, "password": "testpass"})
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")
    response = client.get("/categories/")
    assert response.status_code == 200
    assert len(response.data) == 2
