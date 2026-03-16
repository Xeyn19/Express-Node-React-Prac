# Job Track (Express + React)

Full-stack Job Application Tracker with JWT auth, job CRUD, dashboard stats, resume uploads, profile preferences, and a modern dark UI.

## Structure

- `backend/` Express API (MySQL, JWT middleware, resume uploads)
- `frontend/` React app (Vite, React Router, Tailwind + DaisyUI, Recharts, Toasts)

## Features

- Register/login with JWT
- Protected routes + auto-logout on expired sessions
- Job applications CRUD (create, edit, delete)
- Resume upload + resume view links (PDF/DOC/DOCX)
- Dashboard stats, charts, and recent jobs
- Search, filter, and sort on applications
- Profile preferences (preferred role, target location)
- Toast notifications, loading states, and empty states

## Run Locally

Open two terminals.

Backend:

```bash
cd backend
npm install
npm start
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL:

- `http://localhost:5173`

## Environment Variables

Backend `.env` (no values in repo):

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

Frontend `.env` (optional):

- `VITE_API_URL`

## API Overview

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

## Notes

- Do not commit `.env` files.
- Do not store credentials or tokens in documentation.
- Resume files are stored under `backend/uploads/` and served from `/uploads`.
