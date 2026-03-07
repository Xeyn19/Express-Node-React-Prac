# Express + React Project

Full-stack practice project with:

- `backend` -> Express API with MySQL auth and JWT protection
- `frontend` -> React + Vite app with login, register, auth context, and protected routes

## Project Structure

```text
Express-Node-React-Prac/
+-- .gitignore
+-- README.md
+-- backend/
|   +-- README.md
|   +-- .env
|   +-- config/
|   |   +-- db.js
|   +-- src/
|   |   +-- app.js
|   |   +-- server.js
|   |   +-- controllers/
|   |   |   +-- authController.js
|   |   |   +-- loginController.js
|   |   |   +-- recipeController.js
|   |   |   +-- registerController.js
|   |   +-- middleware/
|   |   |   +-- authMiddleware.js
|   |   +-- models/
|   |   |   +-- authModel.js
|   |   |   +-- loginModel.js
|   |   |   +-- recipeModel.js
|   |   |   +-- registerModel.js
|   |   +-- routes/
|   |   |   +-- authRoutes.js
|   |   |   +-- index.js
|   |   |   +-- loginRoutes.js
|   |   |   +-- recipeRoutes.js
|   |   |   +-- registerRoute.js
|   |   +-- utils/
|   |       +-- token.js
|   +-- package.json
|   +-- package-lock.json
+-- frontend/
    +-- README.md
    +-- public/
    +-- src/
    |   +-- App.jsx
    |   +-- main.jsx
    |   +-- index.css
    |   +-- assets/
    |   +-- components/
    |   |   +-- ProtectedRoute.jsx
    |   +-- context/
    |   |   +-- AuthContext.jsx
    |   +-- lib/
    |   |   +-- api.js
    |   |   +-- auth.js
    |   +-- pages/
    |       +-- Dashboard.jsx
    |       +-- Home.jsx
    |       +-- Login.jsx
    |       +-- Recipes.jsx
    |       +-- Register.jsx
    +-- index.html
    +-- package.json
    +-- package-lock.json
    +-- vite.config.js
```

Notes:

- `node_modules` and build output are omitted from the tree
- local `.env` files must stay out of version control
- do not put database credentials or token secrets in documentation

## Current Auth Flow

1. User registers from the frontend
2. Backend creates the account with `POST /api/register`
3. Frontend redirects the user to `/login`
4. User logs in with `POST /api/login`
5. Backend returns:
   - `accessToken`
   - `refreshToken`
   - `user`
6. Frontend stores the session locally
7. Protected frontend routes are guarded with `ProtectedRoute`
8. Protected backend routes require `Authorization: Bearer <accessToken>`
9. When the access token expires, the frontend requests a new one with `POST /api/auth/refresh`

## Main Features

- user registration
- user login
- JWT access token + refresh token flow
- backend auth middleware
- protected API route for recipes
- frontend auth context
- protected frontend routes for dashboard and recipes
- logout flow with local session cleanup

## Run The Project

Open two terminals.

### Backend

```bash
cd backend
npm install
npm start
```

Default backend URL:

- `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL:

- `http://localhost:3000`

## Environment Files

Use local `.env` files only.

### Backend `.env`

Required variable names:

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

### Frontend `.env`

Optional variable:

- `VITE_API_URL`

Example:

```env
VITE_API_URL=http://localhost:8000
```

## Main Routes

### Backend

- `POST /api/register`
- `POST /api/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `GET /api/recipes`

### Frontend

- `/`
- `/register`
- `/login`
- `/dashboard`
- `/recipes`

## Documentation

- Backend docs: [backend/README.md](E:\xampp\htdocs\Express-Node-React-Prac\backend\README.md)
- Frontend docs: [frontend/README.md](E:\xampp\htdocs\Express-Node-React-Prac\frontend\README.md)
