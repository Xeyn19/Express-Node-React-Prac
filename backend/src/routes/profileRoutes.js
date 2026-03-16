import express from "express";
import {
  getProfile,
  updateProfile,
} from "../controllers/profileController.js";
import { authenticateAccessToken } from "../middleware/authMiddleware.js";

const profileRouter = express.Router();

profileRouter.get("/", authenticateAccessToken, getProfile);
profileRouter.put("/", authenticateAccessToken, updateProfile);

export default profileRouter;
