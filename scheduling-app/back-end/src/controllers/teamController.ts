import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Team from '../models/Team'; // Import the Team model

// Create a new team
export const createTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, admin } = req.body;

    // Validate input data
    if (typeof name !== 'string' || typeof admin !== 'string') {
      res.status(400).json({ error: 'Invalid input data' });
      return;
    }

    // Check if team already exists
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      res.status(400).json({ error: 'Team already exists' });
      return;
    }

    // Create a new team
    const team = new Team({
      _id: new mongoose.Types.ObjectId(), // Use ObjectId instead of uuid
      name,
      admin,
      members: [admin],
    });
    await team.save();

    res.status(201).json({ message: 'Team created successfully', team });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Join a team
export const joinTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId, username } = req.body;

    // Validate input data
    if (typeof teamId !== 'string' || typeof username !== 'string') {
      res.status(400).json({ error: 'Invalid input data' });
      return;
    }

    // Find the team
    const team = await Team.findById(teamId);
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    // Add the user to the team if not already a member
    if (!team.members.includes(username)) {
      team.members.push(username);
      await team.save();
    }

    res.status(200).json({ message: 'Joined the team successfully' });
  } catch (error) {
    console.error('Error joining team:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Leave a team
export const leaveTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId, username } = req.body;

    // Validate input data
    if (typeof teamId !== 'string' || typeof username !== 'string') {
      res.status(400).json({ error: 'Invalid input data' });
      return;
    }

    // Find the team
    const team = await Team.findById(teamId);
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    // Remove the user from the team
    team.members = team.members.filter(member => member !== username);
    await team.save();

    res.status(200).json({ message: 'Left the team successfully' });
  } catch (error) {
    console.error('Error leaving team:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
