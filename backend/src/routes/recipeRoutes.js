import express from "express";
import { showRecipes } from "../controllers/recipeController.js";
import { authenticateAccessToken } from "../middleware/authMiddleware.js";

const recipeRouter = express.Router();

recipeRouter.get("/", authenticateAccessToken, showRecipes);

export default recipeRouter;
