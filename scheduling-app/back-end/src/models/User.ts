import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for User document
interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
}

const userSchema: Schema<IUser> = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
