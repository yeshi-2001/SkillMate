import requests
import json
import time

BASE_URL = "http://localhost:5000/api"

print("=" * 60)
print("SKILLMATE LOGIN FLOW TEST")
print("=" * 60)

# Step 1: Register a test user
print("\n[1] Registering test user...")
register_data = {
    "name": "Test User",
    "email": f"test{int(time.time())}@test.com",
    "password": "password123",
    "location": "Test City"
}

try:
    response = requests.post(f"{BASE_URL}/register", json=register_data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 201:
        data = response.json()
        token = data['data']['token']
        user = data['data']['user']
        print(f"✓ Registration successful!")
        print(f"  User ID: {user['id']}")
        print(f"  Email: {user['email']}")
        print(f"  Token: {token[:30]}...")
    else:
        print(f"✗ Registration failed: {response.json()}")
        exit(1)
except Exception as e:
    print(f"✗ Error: {e}")
    exit(1)

# Step 2: Test login with same credentials
print(f"\n[2] Testing login with email: {register_data['email']}...")
login_data = {
    "email": register_data['email'],
    "password": register_data['password']
}

try:
    response = requests.post(f"{BASE_URL}/login", json=login_data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        token = data['data']['token']
        user = data['data']['user']
        print(f"✓ Login successful!")
        print(f"  User ID: {user['id']}")
        print(f"  Token: {token[:30]}...")
    else:
        print(f"✗ Login failed: {response.json()}")
        exit(1)
except Exception as e:
    print(f"✗ Error: {e}")
    exit(1)

# Step 3: Test profile endpoint with token
print(f"\n[3] Testing profile endpoint with token...")
headers = {"Authorization": f"Bearer {token}"}

try:
    response = requests.get(f"{BASE_URL}/user/profile", headers=headers)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        profile = data['data']
        print(f"✓ Profile fetch successful!")
        print(f"  Name: {profile['name']}")
        print(f"  Email: {profile['email']}")
        print(f"  Location: {profile.get('location', 'N/A')}")
    else:
        print(f"✗ Profile fetch failed: {response.json()}")
        print("\n⚠️  THIS IS THE PROBLEM!")
        print("The token is valid but profile endpoint is failing.")
        exit(1)
except Exception as e:
    print(f"✗ Error: {e}")
    exit(1)

# Step 4: Test protected endpoint (skills)
print(f"\n[4] Testing protected endpoint (skills)...")

try:
    response = requests.get(f"{BASE_URL}/skills/user", headers=headers)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print(f"✓ Skills endpoint working!")
    else:
        print(f"✗ Skills endpoint failed: {response.json()}")
except Exception as e:
    print(f"✗ Error: {e}")

print("\n" + "=" * 60)
print("TEST COMPLETE")
print("=" * 60)
print("\nIf all tests passed, the backend is working correctly.")
print("The issue is likely in the React frontend.")
