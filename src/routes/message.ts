import { Router } from "express"
import MessageController from "../controllers/messageController"
import { authenticateToken } from '../middlewares/authenticateToken'

const router = Router()

// Create new message
router.post('/', [authenticateToken], MessageController.newMessage)

export default router