# Frontend (React + Vite)

React frontend for register, login, protected routing, dashboard session handling, and protected recipe fetching.

## Stack

- React
- React Router
- Tailwind CSS
- DaisyUI

## Requirements

- Node.js 18+
- Backend running locally or at a configured API URL

## Install and Run

```bash
npm install
npm run dev
```

Default frontend URL:

- `http://localhost:3000`

## Environment

Set the backend base URL with `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

## Routes

- `/` -> home page
- `/register` -> account registration
- `/login` -> login page
- `/dashboard` -> protected dashboard route
- `/recipes` -> protected recipes route

## Auth Flow

1. User registers from `/register`
2. Frontend sends `POST /api/register`
3. After success, frontend redirects to `/login`
4. User logs in from `/login`
5. Frontend sends `POST /api/login`
6. Frontend stores:
   - `accessToken`
   - `refreshToken`
   - `authUser`
7. User is redirected to `/dashboard`
8. Protected pages use the stored access token automatically
9. If the access token expires, frontend requests a new one with the refresh token

## Protected Routing

Protected routing is handled with:

- `AuthContext`
- `ProtectedRoute`

Protected pages:

- `/dashboard`
- `/recipes`

If there is no valid authenticated session, the user is redirected to `/login`.

## Session Handling

Frontend auth/session helpers are split into:

- `src/lib/auth.js` -> local storage helpers
- `src/lib/api.js` -> API calls and refresh-token retry logic
- `src/context/AuthContext.jsx` -> shared auth state
- `src/components/ProtectedRoute.jsx` -> route guard

## Backend Integration

Frontend uses these backend endpoints:

- `POST /api/register`
- `POST /api/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `GET /api/recipes`

## Behavior Notes

- Register does not log the user in automatically
- Login is the only flow that stores JWTs
- Dashboard uses shared auth context
- Recipes page uses authenticated API requests
- Logout clears local session data and returns the user to `/login`

## Scripts

- `npm run dev` -> start development server
- `npm run build` -> build for production
- `npm run preview` -> preview production build
- `npm run lint` -> run ESLint
