import express from 'express'
import { showRecipes, userLogin, userSignUp } from './controller.js'

const router = express.Router()

router.get('/login', userLogin)
router.get('/signup', userSignUp)
router.get('/recipes', showRecipes)


export default router