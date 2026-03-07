import { verifyAccessToken } from "../utils/token.js";

export const authenticateAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access token is required. Use Authorization: Bearer <token>.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired access token.",
      error: error.message,
    });
  }
};
