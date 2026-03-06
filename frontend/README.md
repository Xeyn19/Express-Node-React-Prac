# Frontend (React + Vite)

This is the frontend app for the project. It uses React, React Router, Tailwind CSS, and DaisyUI.

## Requirements

- Node.js 18+
- Backend running on `http://localhost:8000` (or set custom API URL)

## Install and Run

```bash
npm install
npm run dev
```

Frontend runs on Vite default URL (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev` -> start development server
- `npm run build` -> production build
- `npm run preview` -> preview built app
- `npm run lint` -> run ESLint

## Routes

- `/` -> Home page
- `/recipes` -> fetches and shows recipes from backend
- `/register` -> registration form (first name, last name, email, password, confirm password)

## Backend Integration

Register form sends:

- `POST /api/register`
- Default API base URL: `http://localhost:8000`

To use a different backend URL, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```
