# Express + React Project

Monorepo-style project with:

- `backend` -> Express API
- `frontend` -> React (Vite) app

This README documents the full repository structure and how to run the project safely without exposing secrets.

## Folder Structure

```text
Express-Node-React-Prac/
+-- .gitignore
+-- backend/
|   +-- README.md
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
|   |   +-- models/
|   |   |   +-- authModel.js
|   |   |   +-- loginModel.js
|   |   |   +-- recipeModel.js
|   |   |   +-- registerModel.js
|   |   +-- routes/
|   |       +-- authRoutes.js
|   |       +-- index.js
|   |       +-- loginRoutes.js
|   |       +-- recipeRoutes.js
|   |       +-- registerRoute.js
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
    |   +-- pages/
    |       +-- Home.jsx
    |       +-- Recipes.jsx
    |       +-- Register.jsx
    |       +-- Login.jsx
    |       +-- Dashboard.jsx
    +-- index.html
    +-- vite.config.js
    +-- package.json
    +-- package-lock.json
```

Notes:

- `node_modules` and build folders are intentionally omitted from this tree.
- Local environment files like `.env` should never be committed.

## How to Run

Open two terminals:

1. Backend

```bash
cd backend
npm install
npm start
```

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

## Security / Credentials

- Keep all DB/API secrets in local `.env` files only.
- Do not paste credentials in README files.
- `.gitignore` is configured to exclude `.env` files from commits.

## Additional Docs

- Backend details: `backend/README.md`
- Frontend details: `frontend/README.md`
