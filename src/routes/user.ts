import { Router } from "express"
import UserController from "../controllers/userController"
import { authenticateToken } from '../middlewares/authenticateToken'

const router = Router()

// Create new user
router.post('/', UserController.newUser)

// Get user by jwt
router.get('/', [authenticateToken], UserController.getOneByJwt)

// Update user by JWT
router.put('/', [authenticateToken], UserController.updateOneByJwt)

export default router