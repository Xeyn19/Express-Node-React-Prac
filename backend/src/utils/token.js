import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const getRequiredEnv = (key) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const buildTokenPayload = (user) => ({
  id: user.id,
  email: user.email,
  first_name: user.first_name ?? user.firstName,
  last_name: user.last_name ?? user.lastName,
});

const accessTokenSecret = () => getRequiredEnv("ACCESS_TOKEN_SECRET");
const refreshTokenSecret = () => getRequiredEnv("REFRESH_TOKEN_SECRET");

const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export const generateAccessToken = (user) =>
  jwt.sign(buildTokenPayload(user), accessTokenSecret(), {
    expiresIn: accessTokenExpiry,
  });

export const generateRefreshToken = (user) =>
  jwt.sign(buildTokenPayload(user), refreshTokenSecret(), {
    expiresIn: refreshTokenExpiry,
  });

export const verifyAccessToken = (token) =>
  jwt.verify(token, accessTokenSecret());

export const verifyRefreshToken = (token) =>
  jwt.verify(token, refreshTokenSecret());
