import express from "express";
import recipeRouter from "./recipeRoutes.js";
import authRouter from "./authRoutes.js";
import registerRouter from "./registerRoute.js";
import loginRouter from "./loginRoutes.js";
import jobRouter from "./jobRoutes.js";
import dashboardRouter from "./dashboardRoutes.js";
import profileRouter from "./profileRoutes.js";

const router = express.Router();

router.use("/recipes", recipeRouter);
router.use("/auth", authRouter);
router.use("/register", registerRouter);
router.use("/login", loginRouter);
router.use("/jobs", jobRouter);
router.use("/dashboard", dashboardRouter);
router.use("/profile", profileRouter);

export default router;
