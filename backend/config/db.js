import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const testConnection = async () => {
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();
  console.log("MySQL connected successfully.");
};

export default pool;
