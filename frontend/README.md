# Frontend (React + Vite)

React UI for the Job Application Tracker. Includes auth screens, dashboard analytics, job management, and responsive layout.

## Stack

- React
- React Router
- Tailwind CSS + DaisyUI
- Recharts
- Axios
- React Toastify

## Requirements

- Node.js 18+
- Backend API running locally or at a configured URL

## Install and Run

```bash
npm install
npm run dev
```

Default frontend URL:

- `http://localhost:3000`

## Environment

Set the backend base URL with `frontend/.env`:

- `VITE_API_URL`

## Routes

- `/` home
- `/register` register
- `/login` login
- `/dashboard` dashboard (protected)
- `/applications` applications list (protected)
- `/add-job` add job (protected)
- `/profile` profile (protected)

## UI Features

- Dashboard stats + charts
- Search, filter, and sort applications
- Add/edit/delete applications
- Resume upload handling
- Toast notifications and loading states
- Mobile sidebar menu

## Notes

- 401 responses trigger auto-logout and redirect to `/login`.
- Tokens are stored in local storage and cleared on logout.
