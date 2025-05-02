import { recipes } from "./data.js"

export const userLogin = (req, res) => {
    res.send('This is User Login')
}

export const userSignUp = (req, res) => {
    res.send('This is User SignUp')
}

export const showRecipes = (req, res) => {
    res.json(recipes)
}