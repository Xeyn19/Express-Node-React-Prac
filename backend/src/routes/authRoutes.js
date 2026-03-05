import express from "express";
import { userLogin, userSignUp } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.get("/login", userLogin);
authRouter.get("/signup", userSignUp);

export default authRouter;
