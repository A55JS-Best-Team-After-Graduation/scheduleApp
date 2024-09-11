import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Import the User model

// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Validate input data
    if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Invalid input data' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists with this email' });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input data
    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Invalid input data' });
      return;
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY as string, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update username, email, and/or password for a user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params; // Assumes the user ID is provided in the URL
    const { username, email, password } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Validate input data (optional fields)
    if (username && typeof username !== 'string') {
      res.status(400).json({ error: 'Invalid username' });
      return;
    }

    if (email && typeof email !== 'string') {
      res.status(400).json({ error: 'Invalid email' });
      return;
    }

    if (password && typeof password !== 'string') {
      res.status(400).json({ error: 'Invalid password' });
      return;
    }

    // Update the username if provided
    if (username) {
      user.username = username;
    }

    // Update the email if provided and ensure it's unique
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== userId) {
        res.status(400).json({ error: 'Email already in use' });
        return;
      }
      user.email = email;
    }

    // Update and hash the password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};