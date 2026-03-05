import express from "express";
import recipeRouter from "./recipeRoutes.js";
import authRouter from "./authRoutes.js";

const router = express.Router();

router.use("/recipes",recipeRouter);
router.use(authRouter);

export default router;
