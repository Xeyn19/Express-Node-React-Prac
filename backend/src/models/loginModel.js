import db from "../../config/db.js";

export const findLoginUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT id, first_name, last_name, email, password FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0] || null;
};
