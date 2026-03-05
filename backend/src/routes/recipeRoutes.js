import express from "express";
import { showRecipes } from "../controllers/recipeController.js";

const recipeRouter = express.Router();

recipeRouter.get("/", showRecipes);

export default recipeRouter;
