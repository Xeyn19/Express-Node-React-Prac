import {
  generateAccessToken,
  verifyRefreshToken,
} from "../utils/token.js";

export const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required." });
  }

  try {
    const user = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken(user);

    return res.status(200).json({
      message: "Access token refreshed successfully.",
      accessToken,
      tokenType: "Bearer",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token.",
      error: error.message,
    });
  }
};

export const getAuthenticatedUser = (req, res) => {
  return res.status(200).json({
    message: "Authenticated user fetched successfully.",
    user: req.user,
  });
};
