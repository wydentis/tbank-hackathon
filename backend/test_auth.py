"""
Test script for JWT authentication endpoints
Run this script after starting the Django server to test the authentication flow
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_register():
    """Test user registration"""
    print("\n1. Testing User Registration...")
    url = f"{BASE_URL}/api/auth/register/"
    data = {
        "username": "testuser",
        "password": "testpass123!@#",
        "password2": "testpass123!@#",
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User"
    }
    
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 201

def test_login():
    """Test user login and get JWT tokens"""
    print("\n2. Testing User Login...")
    url = f"{BASE_URL}/api/auth/login/"
    data = {
        "username": "testuser",
        "password": "testpass123!@#"
    }
    
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        tokens = response.json()
        print(f"Access Token: {tokens['access'][:50]}...")
        print(f"Refresh Token: {tokens['refresh'][:50]}...")
        return tokens
    else:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return None

def test_profile(access_token):
    """Test accessing protected profile endpoint"""
    print("\n3. Testing Profile Access (Protected Endpoint)...")
    url = f"{BASE_URL}/api/auth/profile/"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    response = requests.get(url, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_token_refresh(refresh_token):
    """Test token refresh"""
    print("\n4. Testing Token Refresh...")
    url = f"{BASE_URL}/api/auth/token/refresh/"
    data = {
        "refresh": refresh_token
    }
    
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        new_tokens = response.json()
        print(f"New Access Token: {new_tokens['access'][:50]}...")
        return new_tokens
    else:
        print(f"Response: {response.text}")
        return None

def test_profile_update(access_token):
    """Test updating user profile"""
    print("\n5. Testing Profile Update...")
    url = f"{BASE_URL}/api/auth/profile/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    data = {
        "first_name": "Updated",
        "email": "updated@example.com"
    }
    
    response = requests.patch(url, json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_invalid_token():
    """Test accessing protected endpoint with invalid token"""
    print("\n6. Testing Invalid Token (Should Fail)...")
    url = f"{BASE_URL}/api/auth/profile/"
    headers = {
        "Authorization": "Bearer invalid_token_here"
    }
    
    response = requests.get(url, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 401

if __name__ == "__main__":
    print("=" * 50)
    print("JWT Authentication System Test")
    print("=" * 50)
    
    try:
        # Note: First registration might succeed, subsequent runs will fail
        # if user already exists
        test_register()
        
        tokens = test_login()
        if tokens:
            test_profile(tokens['access'])
            test_token_refresh(tokens['refresh'])
            test_profile_update(tokens['access'])
        
        test_invalid_token()
        
        print("\n" + "=" * 50)
        print("Test completed!")
        print("=" * 50)
    except requests.exceptions.ConnectionError:
        print("\nError: Could not connect to the server.")
        print("Make sure the Django server is running on http://localhost:8000")
    except Exception as e:
        print(f"\nError occurred: {str(e)}")
