// routes/userRoutes.ts
import express from 'express';
import { registerUser, loginUser, updateUser } from '../controllers/userController';

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for update user data
router.post('/:userId', updateUser);

export default router;
