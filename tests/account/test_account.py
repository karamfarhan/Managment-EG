import pytest

# from django.test import Client
from rest_framework.test import APIClient

from apps.account.models import Account
from tests.factories import AccountFactory

client = APIClient()


@pytest.mark.parametrize(
    "email, username, password, confirm_password, validity",
    [
        ("test@example.com", "testuser", "testpass", "testpass", 201),
        ("test@example.com", "testuser", "testpass", "testpass2", 400),
        ("", "testuser", "testpass", "testpass", 400),
        ("test@example.com", "", "testpass", "testpass", 400),
        ("test@example.com", "testuser", "", "testpass", 400),
        ("test@example.com", "testuser", "testpass", "", 400),
    ],
)
@pytest.mark.django_db
def test_create_account(email: str, username: str, password: str, confirm_password: str, validity: int):
    data = {"email": email, "username": username, "password": password, "confirm_password": confirm_password}
    response = client.post("/account/register/", data=data)
    assert response.status_code == validity
    if validity == 201:
        assert response.data["username"] == data["username"]
        assert response.data["email"] == data["email"]
        assert "passowrd" not in response.data
        assert "pk" and "message" in response.data


@pytest.mark.parametrize(
    "email, username, password, confirm_password, validity",
    [
        ("test7@example.com", "testuser7", "testpass", "testpass", 201),
        ("test@example.com", "testuser7", "testpass", "testpass", 400),
        ("test7@example.com", "testuser", "testpass", "testpass", 400),
    ],
)
@pytest.mark.django_db
def test_create_account_with_exsisting_email_username(
    account_factory, email: str, username: str, password: str, confirm_password: str, validity: int
):
    account_factory.create()
    data = {"email": email, "username": username, "password": password, "confirm_password": confirm_password}
    response = client.post("/account/register/", data=data)
    assert response.status_code == validity


@pytest.mark.parametrize(
    "email, password, validity",
    [
        ("test@example.com", "testpass", 200),
        ("wrongtest@example.com", "testpass", 401),
        ("test@example.com", "wrongtestpass", 401),
    ],
)
@pytest.mark.django_db
def test_login_account(account_factory, email: str, password: str, validity: int):
    account_factory.create()
    # Retrieve the account
    response = client.post("/account/login_token/", data={"email": email, "password": password})
    assert response.status_code == validity
    if validity == 200:
        assert "access" and "refresh" in response.data


@pytest.mark.django_db
def test_view_account(account_factory):
    # Create an account
    account = account_factory.create()
    # Retrieve the account
    login_response = client.post("/account/login_token/", data={"email": account.email, "password": "testpass"})
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")
    response = client.get("/account/view/")
    assert response.status_code == 200
    assert "pk" and "first_name" in response.data


@pytest.mark.django_db
def test_edit_account(account_factory):
    # Create an account
    account = account_factory.create()
    login_response = client.post("/account/login_token/", data={"email": account.email, "password": "testpass"})
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")

    update_data = {
        "email": "updatetest@example.com",
        "username": "updatetestuser",
        "first_name": "firstname",
        "last_name": "lastname",
        "hide_email": False,
    }
    response = client.put("/account/edit/", data=update_data)
    assert response.status_code == 200
    assert response.data["username"] == update_data["username"]
    assert response.data["email"] == update_data["email"]
    assert response.data["first_name"] == update_data["first_name"]
    assert response.data["last_name"] == update_data["last_name"]
    assert response.data["hide_email"] == update_data["hide_email"]
    assert "pk" in response.data


@pytest.mark.parametrize(
    "old_password, new_password, confirm_new_password, validity",
    [
        ("testpass", "newtestpass", "newtestpass", 200),
        ("testpass", "testpass", "testpass", 400),
        ("wrongtestpass", "newtestpass", "newtestpass", 400),
        ("testpass", "newtestpass1", "newtestpass2", 400),
    ],
)
@pytest.mark.django_db
def test_change_account_password(
    account_factory, old_password: str, new_password: str, confirm_new_password: str, validity: int
):
    # Create an account
    account = account_factory()
    login_response = client.post("/account/login_token/", data={"email": account.email, "password": "testpass"})
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")
    response = client.put(
        "/account/change_password/",
        {"old_password": old_password, "new_password": new_password, "confirm_new_password": confirm_new_password},
    )
    assert response.status_code == validity


@pytest.mark.django_db
def test_account_refresh_token(account_factory):
    # Create an account
    account = account_factory()
    login_response = client.post("/account/login_token/", data={"email": account.email, "password": "testpass"})
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")

    response = client.post("/account/token/refresh/", data={"refresh": login_response.data["refresh"]})
    assert response.status_code == 200
    assert "access" in response.data
    assert login_response.data["access"] != response.data["access"]


@pytest.mark.parametrize(
    "email, validity, validity2",
    [
        ("test@example.com", 200, True),
        ("wrongtest@example.com", 404, False),
    ],
)
@pytest.mark.django_db
def test_check_email_account(account_factory, email: str, validity: int, validity2: bool):
    # Create an account
    account_factory()
    response = client.post("/account/check_email/", data={"email": email})
    assert response.status_code == validity
    assert response.data["is_exists"] == validity2
