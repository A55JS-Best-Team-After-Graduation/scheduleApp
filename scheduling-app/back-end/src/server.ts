import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import app from './app'; // Import your Express app
import connectDB from './config/dbConnection'; // Import your MongoDB connection
import Team from './models/Team'; // Import Team model
import Message from './models/Message'; // Import Message model
import User from './models/User'; // Import User model

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

// Get environment variables or define them with default values
const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue!;
};

const PORT: number = parseInt(getEnvVariable('PORT', '3500'), 10);

// CORS logic
const parseOrigins = (origins: string): string[] => origins.split(',').map((origin) => origin.trim());
const isCORSDisabled = process.env.CORS_ORIGIN_PROD === 'false';
const CORS_ORIGIN = process.env.NODE_ENV === 'production'
  ? isCORSDisabled
    ? false
    : process.env.CORS_ORIGIN_PROD || ''
  : parseOrigins(process.env.CORS_ORIGIN_DEV || '');

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Define namespace for chat
const chatNsp = io.of('/chat');

chatNsp.on('connection', (socket: Socket) => {
  const username = socket.handshake.query.username as string || 'Anonymous';

  console.log('New client connected:', socket.id);

  socket.emit('message', { username: 'System', message: 'Welcome to our schedule app!' });

  // Handle joining a team
  socket.on('joinTeam', async (teamName: string) => {
    try {
      console.log(`Socket ${socket.id} attempting to join team: ${teamName}`);

      if (typeof teamName !== 'string') {
        throw new Error('Team name must be a string');
      }

      // Find or create user
      let user = await User.findOne({ username });
      if (!user) {
        // Create a new user if not exists (example, adapt as needed)
        user = new User({ username });
        await user.save();
      }

      // Find or create the team
      let team = await Team.findOne({ name: teamName });

      if (!team) {
        // Create a new team with the socket's userId as admin
        team = new Team({
          _id: new mongoose.Types.ObjectId(),
          name: teamName,
          admin: user._id,
          members: [user._id],
        });
        await team.save();
        console.log(`Created new team ${team._id}. Socket ${socket.id} joining team.`);
      } else {
        // Add the user to the team if they are not already a member
        if (!team.members.includes(user._id)) {
          team.members.push(user._id);
          await team.save();
          console.log(`Added ${username} to team ${team._id}`);
        }
      }

      // Join the team room
      socket.join(team._id.toString());
      socket.emit('teamCreated', { teamId: team._id, teamName });

      // Notify the team of the new user
      chatNsp.to(team._id.toString()).emit('message', { username: 'System', message: `${username} has joined the team ${teamName}` });

    } catch (error) {
      console.error(`Error during team join process for socket ${socket.id}:`, error);
      socket.emit('error', { message: 'Failed to join team' });
    }
  });

  // Handle leaving a team
  socket.on('leaveTeam', async (teamId: string) => {
    try {
      if (teamId) {
        // Find the team and remove the user from the team
        const team = await Team.findById(teamId);
        if (team) {
          const user = await User.findOne({ username });
          if (user) {
            team.members = team.members.filter(member => !member.equals(user._id));
            await team.save();
            console.log(`Socket ${socket.id} left team: ${teamId}`);
            socket.leave(teamId);
            chatNsp.to(teamId).emit('message', {
              username: 'System',
              message: `${username} has left the team.`,
            });
          }
        }
      } else {
        console.log(`Socket ${socket.id} attempted to leave a team without providing teamId.`);
      }
    } catch (error) {
      console.error(`Error during team leave process for socket ${socket.id}:`, error);
      socket.emit('error', { message: 'Failed to leave team' });
    }
  });

  // Handle incoming messages
  socket.on('message', async ({ teamId, message, username }: { teamId: string; message: string; username?: string }) => {
    try {
      if (!message || typeof message !== 'string' || !message.trim()) {
        return;
      }

      const team = await Team.findById(teamId);
      if (team) {
        const user = await User.findOne({ username });
        const userId = user ? user._id : 'Anonymous'; // Default to Anonymous if user not found

        const newMessage = new Message({
          _id: new mongoose.Types.ObjectId(),
          teamId,
          username: username || 'Anonymous',
          message,
        });
        await newMessage.save();
        chatNsp.to(teamId).emit('message', { username: username || 'Anonymous', message });
      } else {
        console.error('Team does not exist:', teamId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected from /chat:', socket.id);
  });
});

// Start the server
const expressServer = httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Graceful Shutdown
const shutdownGracefully = async () => {
  if (expressServer) {
    try {
      await new Promise<void>((resolve, reject) => {
        expressServer.close((err) => {
          if (err) {
            console.error('Error closing HTTP server:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
      console.log('HTTP server closed.');

      await mongoose.connection.close();
      console.log('MongoDB connection closed.');

      process.exit(0);
    } catch (error) {
      console.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }
};

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err.stack || err.message);
  shutdownGracefully();
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdownGracefully();
});

process.on('SIGTERM', shutdownGracefully);
process.on('SIGINT', shutdownGracefully);
