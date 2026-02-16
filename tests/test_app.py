from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)

def test_get_activities():
    response = client.get("/activities")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)

def test_signup_and_prevent_duplicate():
    activity = "Chess Club"
    email = "test@mergington.edu"

    # signup first time
    response = client.post(f"/activities/{activity}/signup", params={"email": email})
    assert response.status_code == 200

    # signup second time should fail
    response = client.post(f"/activities/{activity}/signup", params={"email": email})
    assert response.status_code == 400

def test_unregister():
    activity = "Chess Club"
    email = "remove@mergington.edu"

    # signup
    response = client.post(f"/activities/{activity}/signup", params={"email": email})
    assert response.status_code == 200

    # unregister
    response = client.post(f"/activities/{activity}/unregister", params={"email": email})
    assert response.status_code == 200
