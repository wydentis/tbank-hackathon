# JWT Authentication System

This authentication system uses Django REST Framework with Simple JWT for token-based authentication.

## Features

- User registration
- JWT token-based authentication
- Token refresh mechanism
- User profile management
- Automatic token rotation and blacklisting

## API Endpoints

### 1. Register a new user
```bash
POST /api/auth/register/
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password",
  "password2": "your_password",
  "email": "your_email@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "username": "your_username",
  "email": "your_email@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

### 2. Login (Obtain JWT tokens)
```bash
POST /api/auth/login/
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Refresh access token
```bash
POST /api/auth/token/refresh/
Content-Type: application/json

{
  "refresh": "your_refresh_token"
}
```

**Response:**
```json
{
  "access": "new_access_token",
  "refresh": "new_refresh_token"
}
```

### 4. Get/Update user profile
```bash
GET /api/auth/profile/
Authorization: Bearer your_access_token

PUT /api/auth/profile/
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "email": "newemail@example.com",
  "first_name": "Jane",
  "last_name": "Smith"
}
```

## Token Configuration

- **Access Token Lifetime**: 60 minutes
- **Refresh Token Lifetime**: 7 days
- **Token Rotation**: Enabled (new refresh token issued on refresh)
- **Blacklist After Rotation**: Enabled (old tokens are invalidated)

## Usage in Requests

Include the access token in the Authorization header:

```bash
Authorization: Bearer your_access_token
```

## Example Usage

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123", "password2": "testpass123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'

# Access protected endpoint
curl http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Refresh token
curl -X POST http://localhost:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "YOUR_REFRESH_TOKEN"}'
```

## Security Notes

- Passwords are validated using Django's built-in validators
- Tokens use HS256 algorithm
- Refresh tokens are rotated on each refresh
- Old tokens are blacklisted after rotation
- Access tokens should be stored securely (e.g., httpOnly cookies or secure storage)
- Never expose refresh tokens in URLs or logs
