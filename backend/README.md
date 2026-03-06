# Backend (Express + MySQL)

This is the backend API for the project. It uses Express, MySQL (`mysql2`), and `bcryptjs` for password hashing.

## Requirements

- Node.js 18+
- XAMPP MySQL running

## Install and Run

```bash
npm install
npm start
```

Backend runs on `http://localhost:8000` by default.

## Environment Variables


## Database Setup (MySQL/XAMPP)

Run this in phpMyAdmin SQL tab:


CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

- `GET /` -> health check
- `GET /api/recipes` -> returns sample recipes
- `GET /api/login` -> sample login message
- `GET /api/signup` -> sample signup message
- `POST /api/register` -> create user in `users` table

### Register Request Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Register Success Response

```json
{
  "message": "Registration successful.",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```
