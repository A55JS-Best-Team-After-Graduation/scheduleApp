import { Request, Response } from 'express';
import Message from '../models/Message'; // Import the Message model
import mongoose from 'mongoose'; // Import mongoose here

// Send a message
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId, username, message } = req.body;

    // Ensure message data is valid
    if (typeof teamId !== 'string' || typeof username !== 'string' || typeof message !== 'string') {
      res.status(400).json({ error: 'Invalid input data' });
      return;
    }

    // Create a new message
    const newMessage = new Message({
      _id: new mongoose.Types.ObjectId(), // Use ObjectId instead of uuid
      teamId,
      username,
      message,
    });
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get messages for a team
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;

    // Ensure teamId is valid
    if (typeof teamId !== 'string') {
      res.status(400).json({ error: 'Invalid teamId' });
      return;
    }

    // Find messages for the team
    const messages = await Message.find({ teamId });

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
