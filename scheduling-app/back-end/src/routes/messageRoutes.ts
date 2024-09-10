import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController';

const router = express.Router();

// Route to send a message
// full path: /api/messages/send
router.post('/send', sendMessage);

// Route to get messages for a specific team
router.get('/:teamId', getMessages); 

export default router;
