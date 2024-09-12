// routes/userRoutes.ts
import express from 'express';
import { registerUser, loginUser, updateUser, deleteUserById, fetchAllUsers, verifyToken } from '../controllers/userController';

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for update user data
router.post('/update/:userId', updateUser);

// Route for delete user
router.post('/delete/:userId', deleteUserById);

// Route for fetching all users
router.post('/all', fetchAllUsers);

// Route to verify token
router.post('/verify-token', verifyToken);

export default router;
