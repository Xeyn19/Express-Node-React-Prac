import { getLoginMessage, getSignUpMessage } from "../models/authModel.js";

export const userLogin = (req, res) => {
  res.json({ message: getLoginMessage() });
};

export const userSignUp = (req, res) => {
  res.json({ message: getSignUpMessage() });
};
