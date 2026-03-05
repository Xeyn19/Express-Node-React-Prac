import { getAllRecipes } from "../models/recipeModel.js";

export const showRecipes = (req, res) => {
  res.json(getAllRecipes());
};
