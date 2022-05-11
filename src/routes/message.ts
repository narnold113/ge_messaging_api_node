import { Router } from "express"
import MessageController from "../controllers/messageController"
import { authenticateToken } from '../middlewares/authenticateToken'

const router = Router()

// Create new message
router.post('/message', [authenticateToken], MessageController.newMessage)

// Retrieve a message
router.get('/message', [authenticateToken], MessageController.getMessage)

// Retrieve messages
router.get('/messages', [authenticateToken], MessageController.getMessages)

// Mark message to "read"
router.put('/mark_message_as_read', [authenticateToken], MessageController.markMessageAsRead)

export default router