import express from "express";
import recipeRouter from "./recipeRoutes.js";
import authRouter from "./authRoutes.js";
import registerRouter from "./registerRoute.js";
import loginRouter from "./loginRoutes.js";
import jobRouter from "./jobRoutes.js";

const router = express.Router();

router.use("/recipes", recipeRouter);
router.use("/auth", authRouter);
router.use("/register", registerRouter);
router.use("/login", loginRouter);
router.use("/jobs", jobRouter);

export default router;
