# Render Deployment Guide

This guide deploys this project to Render:

- `backend/` as a Render **Web Service**
- `frontend/` as a Render **Static Site**
- MySQL hosted outside Render, for example Aiven

Use this together with [aiven_mysql_setup.md](E:\xampp\htdocs\Job-Application-Tracker\aiven_mysql_setup.md).

## 1. Understand the Project Structure

This repo is not a single Node app at the root.

- `backend/` contains the Express API
- `frontend/` contains the React + Vite app

That means you should not deploy the repository root as one Node service.

## 2. Prepare the Database First

Before deploying the backend, create a hosted MySQL database.

Recommended:

- Aiven MySQL free tier

You will need these values later:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

You also need to import your schema and tables before testing the API.

## 3. Deploy the Backend on Render

In Render:

1. Click **New +**
2. Choose **Web Service**
3. Connect your GitHub repository
4. Select this repo

Use these backend settings:

- **Name**: any backend service name you want
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

## 4. Add Backend Environment Variables

In the backend Render service, add:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`

Optional:

- `PORT`
- `ACCESS_TOKEN_EXPIRES_IN`
- `REFRESH_TOKEN_EXPIRES_IN`

Suggested values:

- `ACCESS_TOKEN_EXPIRES_IN=15m`
- `REFRESH_TOKEN_EXPIRES_IN=7d`

Notes:

- Do not set `DB_HOST=localhost`
- On Render, `localhost` means the Render container, not your XAMPP MySQL
- `PORT` is usually provided by Render automatically

## 5. First Backend Deploy Check

After deployment starts:

1. Open the backend logs
2. Wait for the service to build
3. Confirm the app starts without database errors

Expected startup behavior:

- the backend installs dependencies
- it connects to MySQL
- it starts listening on Render's port

If it fails, the most common reasons are:

- wrong DB credentials
- missing database schema
- missing JWT secrets

## 6. Test the Backend URL

Once deployed, open your backend URL in the browser.

Example:

- `https://your-backend-name.onrender.com`

This project should respond on `/` with:

- `Backend API is running`

You should also verify your API routes using the deployed base URL.

## 7. Important Uploads Warning

This backend stores resumes on the server filesystem:

- `/uploads/resumes`

That works locally, but on Render this has an important limitation:

- files stored on the service filesystem are not reliable for long-term persistence

If your service restarts or is redeployed, uploaded resumes may be lost unless you use:

- a Render persistent disk, if your plan supports it
- or an external file storage service such as Cloudinary, S3, Supabase Storage, or Uploadcare

If resume uploads matter in production, plan to move them out of local disk storage.

## 8. Deploy the Frontend on Render

After the backend is live, deploy the frontend.

In Render:

1. Click **New +**
2. Choose **Static Site**
3. Connect the same GitHub repository
4. Select this repo

Use these frontend settings:

- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

## 9. Add Frontend Environment Variable

The frontend reads:

- `VITE_API_URL`

Set it in the frontend Render service to your deployed backend URL.

Example:

- `VITE_API_URL=https://your-backend-name.onrender.com`

Do not use:

- `http://localhost:8000`

That only works on your computer.

## 10. Redeploy the Frontend

After setting `VITE_API_URL`:

1. Trigger a frontend redeploy
2. Open the deployed frontend
3. Test login, registration, dashboard, and job CRUD

## 11. Verify CORS If Needed

Your backend currently uses:

- `app.use(cors())`

That allows requests broadly, which is fine for initial deployment.

If you later want stricter security, limit CORS to your frontend domain.

## 12. Deployment Order

Use this order:

1. Create hosted MySQL
2. Import database schema
3. Deploy backend
4. Add backend environment variables
5. Verify backend is live
6. Deploy frontend
7. Set `VITE_API_URL`
8. Verify the full app

## 13. Common Mistakes

- deploying from the repo root instead of `backend` or `frontend`
- setting the backend build command to just `npm`
- leaving frontend `VITE_API_URL` pointed at localhost
- using local XAMPP MySQL instead of hosted MySQL
- forgetting JWT secrets
- forgetting to import tables into the hosted database
- assuming uploaded files are permanently stored on Render

## 14. Quick Reference

Backend Render settings:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Frontend Render settings:

- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

Backend env vars:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`

Frontend env vars:

- `VITE_API_URL`
