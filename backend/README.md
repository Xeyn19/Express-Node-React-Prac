# Backend (Express API)

Express API for registration, login, JWT authentication, token refresh, and a protected recipes route.

## Stack

- Express
- MySQL (`mysql2`)
- `bcryptjs`
- `jsonwebtoken`
- `dotenv`

## Requirements

- Node.js 18+
- A running MySQL server

## Install and Run

```bash
npm install
npm start
```

Default backend URL:

- `http://localhost:8000`

## Environment

Create `backend/.env` locally with your own values.

Required keys:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRES_IN`
- `REFRESH_TOKEN_EXPIRES_IN`

Example shape only:

```env
PORT=8000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
ACCESS_TOKEN_SECRET=your_long_random_access_secret
REFRESH_TOKEN_SECRET=your_long_random_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

Notes:

- Do not commit `.env`
- Do not store issued access tokens or refresh tokens in `.env`
- `.env` should only store secret keys and config values

## Auth Flow

1. User registers with `POST /api/register`
2. Frontend redirects user to `/login`
3. User logs in with `POST /api/login`
4. Backend returns:
   - `accessToken`
   - `refreshToken`
   - `user`
5. Protected requests send:
   - `Authorization: Bearer <accessToken>`
6. When the access token expires, frontend calls `POST /api/auth/refresh`

## Routes

- `GET /` -> health check
- `POST /api/register` -> create account
- `POST /api/login` -> login and issue JWTs
- `POST /api/auth/refresh` -> issue a new access token using a refresh token
- `GET /api/auth/me` -> return authenticated user
- `GET /api/recipes` -> protected sample recipes route

## Request Examples

### Register

`POST /api/register`

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

Response returns:

- success message
- created user data

### Login

`POST /api/login`

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Response returns:

- success message
- `accessToken`
- `refreshToken`
- `tokenType`
- user data

### Refresh Access Token

`POST /api/auth/refresh`

```json
{
  "refreshToken": "your_refresh_token_here"
}
```

### Authenticated Request

Example header for protected routes:

```http
Authorization: Bearer your_access_token_here
```

## Protected Middleware

JWT middleware validates the access token before allowing access to:

- `GET /api/auth/me`
- `GET /api/recipes`

If the token is missing, invalid, or expired, the API responds with `401 Unauthorized`.
