// routes/userRoutes.ts
import express from 'express';
import { registerUser, loginUser } from '../controllers/userController';

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for update user data
router.post('/:id', );

export default router;
