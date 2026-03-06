import express from "express";
import recipeRouter from "./recipeRoutes.js";
import authRouter from "./authRoutes.js";
import registerRouter from "./registerRoute.js";

const router = express.Router();

router.use("/recipes", recipeRouter);
router.use(authRouter);
router.use("/register", registerRouter);

export default router;
