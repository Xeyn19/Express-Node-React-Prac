import db from "../../config/db.js";

export const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT id, email FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
};

export const createUser = async ({
  firstName,
  lastName,
  email,
  hashedPassword,
}) => {
  const [result] = await db.query(
    "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
    [firstName, lastName, email, hashedPassword]
  );

  return result.insertId;
};
