import express from "express";
import {
  getAuthenticatedUser,
  refreshAccessToken,
} from "../controllers/authController.js";
import { authenticateAccessToken } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/refresh", refreshAccessToken);
authRouter.get("/me", authenticateAccessToken, getAuthenticatedUser);

export default authRouter;
