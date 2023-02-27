import pytest

# from django.test import Client
from rest_framework.test import APIClient

client = APIClient()


@pytest.mark.parametrize(
    "name, description, units, unit_type, validity",
    [
        ("sub-name", "this is a description", 1000, "KL", 201),
        ("sub-name", "DNS", 1000, "KL", 201),
        ("sub-name", "this is a description", "DNS", "KL", 201),
        ("DNS", "this is a description", 1000, "KL", 400),
        ("sub-name", "this is a description", 1000, "NOT", 400),
        ("sub-name", "this is a description", 1000, "DNS", 400),
    ],
)
@pytest.mark.django_db
def test_create_substance(
    account_factory, category_factory, name: str, description: str, units: int, unit_type: str, validity: int
):
    # Create an account
    account = account_factory.create()
    cat1 = category_factory.create(name="cat1")
    cat2 = category_factory.create(name="cat2")
    login_response = client.post("/account/login_token/", data={"email": account.email, "password": "testpass"})
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")

    substance_data = {
        "category": [cat1.name, cat2.name],
    }
    if name != "DNS":
        substance_data["name"] = name
    if description != "DNS":
        substance_data["description"] = description
    if units != "DNS":
        substance_data["units"] = units
    if unit_type != "DNS":
        substance_data["unit_type"] = unit_type

    response = client.post("/substances/", data=substance_data)

    assert response.status_code == validity
    if validity == 201:
        assert response.data["name"] == name
        assert response.data["unit_type"] == unit_type
        assert len(response.data["category"]) == 2
        assert response.data["description"] == (description if description != "DNS" else "No description")
        assert response.data["is_available"] is True
        assert response.data["units"] == (units if units != "DNS" else 1)


@pytest.mark.django_db
def test_get_substance(account_factory, category_factory, substance_factory):
    account = account_factory()
    category = category_factory()
    substance = substance_factory(account=account, category=[category])

    login_response = client.post("/account/login_token/", data={"email": account.email, "password": "testpass"})
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")

    response = client.get(f"/substances/{substance.pk}")

    assert response.status_code == 201
    assert response.data["name"] == substance.name
    assert response.data["unit_type"] == substance.unit_type
    assert len(response.data["category"]) == 2
    assert response.data["description"] == substance.description
    assert response.data["is_available"] == substance.is_available
    assert response.data["units"] == substance.units
