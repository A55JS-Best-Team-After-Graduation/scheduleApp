// app.ts is the entry point for the back-end server
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import teamRoutes from './routes/teamRoutes';
import messageRoutes from './routes/messageRoutes';
import connectDB from './config/dbConnection'; // MongoDB connection

dotenv.config(); // Load environment variables

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes); // Handles /api/users/register, /api/users/login, /api/users/update/:userId, /api/users/delete/:userId, /api/users/all
app.use('/api/teams', teamRoutes); // Handles /api/teams/create, /api/teams/join, /api/teams/leave
app.use('/api/messages', messageRoutes); // Handles /api/messages/send, /api/messages/:teamId

// Serve static files (for client-side app)
app.use(express.static(path.join(__dirname, '../client')));

// Fallback route for SPA (Single Page Application)
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// Export the app so it can be used in the server
export default app;
