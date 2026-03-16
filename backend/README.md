# Backend (Express API)

Express API for the Job Tracker app. Handles auth, job applications, dashboard stats, profile preferences, and resume uploads.

## Stack

- Express
- MySQL (`mysql2`)
- `bcryptjs`
- `jsonwebtoken`
- `multer`
- `dotenv`

## Requirements

- Node.js 18+
- MySQL server

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

## API Routes

Auth:

- `POST /api/register`
- `POST /api/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

Jobs:

- `GET /api/jobs`
- `POST /api/jobs`
- `PATCH /api/jobs/:id`
- `DELETE /api/jobs/:id`

Profile:

- `GET /api/profile`
- `PUT /api/profile`

Dashboard:

- `GET /api/dashboard/stats`

## Uploads

- Resume uploads are stored under `backend/uploads/`.
- Files are served from `/uploads`.

## Notes

- Do not commit `.env` files or credentials.
- All protected routes require `Authorization: Bearer <token>`.
