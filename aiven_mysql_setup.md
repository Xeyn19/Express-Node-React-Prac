# Aiven MySQL Setup for Render

This project's backend is deployed separately from your local XAMPP stack, so it needs a hosted MySQL database.

## 1. Create a Free Aiven MySQL Database

1. Go to `https://aiven.io/free-mysql-database`
2. Sign up or log in
3. Create a new **MySQL** service
4. Choose the **Free** plan
5. Wait for the database service to finish provisioning

## 2. Get the Database Credentials

From the Aiven dashboard, open your MySQL service and copy these values:

- `host`
- `port`
- `database`
- `username`
- `password`

You will use them in Render.

## 3. Configure Render Environment Variables

Open your Render backend service and add these environment variables:

- `DB_HOST` = your Aiven host
- `DB_PORT` = your Aiven port
- `DB_NAME` = your Aiven database name
- `DB_USER` = your Aiven username
- `DB_PASSWORD` = your Aiven password
- `ACCESS_TOKEN_SECRET` = any long random secret string
- `REFRESH_TOKEN_SECRET` = any long random secret string

Optional:

- `ACCESS_TOKEN_EXPIRES_IN` = `15m`
- `REFRESH_TOKEN_EXPIRES_IN` = `7d`

## 4. Render Service Settings

For the backend service on Render, use:

- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

## 5. Import Your Database Schema

If your project has a `.sql` export or schema file, import it into Aiven before starting the backend.

Typical options:

- Use **MySQL Workbench**
- Use **DBeaver**
- Use the `mysql` CLI

You need your tables to exist before the backend starts, or API calls will fail even if the database connection works.

## 6. Important Note About `localhost`

Do not use:

- `DB_HOST=localhost`

On Render, `localhost` means the Render container itself, not your computer and not XAMPP.

## 7. Verify the Deployment

After saving the Render environment variables:

1. Trigger a redeploy
2. Open the Render logs
3. Confirm you see a successful database connection message

If the backend fails on startup, check:

- wrong database host or port
- wrong username or password
- missing tables
- missing `ACCESS_TOKEN_SECRET`
- missing `REFRESH_TOKEN_SECRET`

## 8. Current Backend Expectations

This backend reads:

- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT`
- `PORT`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRES_IN`
- `REFRESH_TOKEN_EXPIRES_IN`

## 9. Next Step

Once Aiven is ready, the next task is to import your SQL schema and test the backend connection from Render.
