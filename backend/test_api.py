import requests
import json

BASE_URL = "http://localhost:5000/api"

print("Testing SkillMate Backend API...\n")

# Test 1: Check if API is running
try:
    response = requests.get("http://localhost:5000/")
    print("✓ Backend is running:", response.json())
except Exception as e:
    print("✗ Backend not running:", str(e))
    exit(1)

# Test 2: Register a test user
print("\n--- Testing Registration ---")
register_data = {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "location": "Test City"
}

try:
    response = requests.post(f"{BASE_URL}/register", json=register_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 201:
        token = response.json()['data']['token']
        print(f"✓ Registration successful! Token: {token[:20]}...")
    elif response.status_code == 409:
        print("User already exists, trying login...")
        
        # Login instead
        login_data = {"email": "test@example.com", "password": "password123"}
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        token = response.json()['data']['token']
        print(f"✓ Login successful! Token: {token[:20]}...")
except Exception as e:
    print(f"✗ Error: {str(e)}")
    exit(1)

# Test 3: Add a skill
print("\n--- Testing Add Skill ---")
headers = {"Authorization": f"Bearer {token}"}
skill_data = {
    "skill_name": "Python Programming",
    "type": "teach"
}

try:
    response = requests.post(f"{BASE_URL}/skills/add", json=skill_data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code in [201, 409]:
        print("✓ Skill endpoint working!")
    else:
        print("✗ Unexpected response")
except Exception as e:
    print(f"✗ Error: {str(e)}")

# Test 4: Get user skills
print("\n--- Testing Get Skills ---")
try:
    response = requests.get(f"{BASE_URL}/skills/user", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print("✓ Get skills working!")
except Exception as e:
    print(f"✗ Error: {str(e)}")

print("\n=== Tests Complete ===")
