import mongoose, { Document, Schema } from 'mongoose';

interface IMessage extends Document {
  teamId: mongoose.Types.ObjectId; // Use ObjectId type
  username: string;
  message: string;
  timestamp: Date;
}

const messageSchema: Schema<IMessage> = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true }, // Use MongoDB ObjectId as the unique identifier
  teamId: { type: Schema.Types.ObjectId, required: true, ref: 'Team' }, // Reference to the team
  username: { type: String, required: true }, // Username of the sender
  message: { type: String, required: true }, // Message content
  timestamp: { type: Date, default: Date.now }, // When the message was sent
});

// Create the Message model
const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
