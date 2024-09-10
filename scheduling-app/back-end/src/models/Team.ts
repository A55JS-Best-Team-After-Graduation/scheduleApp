import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for Team document
interface ITeam extends Document {
  _id: mongoose.Types.ObjectId; // Use ObjectId for unique identifier
  name: string;
  admin: mongoose.Types.ObjectId; // Admin as ObjectId to link with User model
  members: mongoose.Types.ObjectId[]; // List of member ObjectIds
}

const teamSchema: Schema<ITeam> = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true }, // Auto-generate ObjectId for team
  name: { type: String, required: true, unique: true }, // Team name
  admin: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, // Reference to User model
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }], // List of member ObjectIds
});

// Create the Team model
const Team = mongoose.model<ITeam>('Team', teamSchema);

export default Team;
