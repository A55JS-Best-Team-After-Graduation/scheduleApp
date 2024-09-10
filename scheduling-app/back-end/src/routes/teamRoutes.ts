// routes/teamRoutes.ts
import express from 'express';
import { createTeam, joinTeam, leaveTeam } from '../controllers/teamController';

const router = express.Router();

// Route to create a team
router.post('/create', createTeam);

// Route to join a team
router.post('/join', joinTeam);

// Route to leave a team
router.post('/leave', leaveTeam);

export default router;
