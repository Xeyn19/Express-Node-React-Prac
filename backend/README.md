# Backend (Express API)

This is the backend API for the project. It uses Express, `mysql2`, and `bcryptjs` for authentication-related logic.

## Requirements

- Node.js 18+
- A running MySQL server

## Install and Run

```bash
npm install
npm start
```

Backend runs on `http://localhost:8000` by default.

## Environment

Create a local `backend/.env` file with your own values. Do not commit it to git.

Required keys:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## API Endpoints

- `GET /` -> health check
- `GET /api/recipes` -> returns sample recipes
- `GET /api/login` -> sample login message route
- `GET /api/signup` -> sample signup message route
- `POST /api/register` -> register user
- `POST /api/login` -> login user

### Register Request Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Login Request Body

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```
