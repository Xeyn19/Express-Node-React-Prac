import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { authenticateAccessToken } from "../middleware/authMiddleware.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/stats", authenticateAccessToken, getDashboardStats);

export default dashboardRouter;
