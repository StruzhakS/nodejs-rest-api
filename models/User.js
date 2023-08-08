import { Schema, model } from 'mongoose';
import handleSaveError from './Hooks/handleSaveError.js';

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 8,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
    },
  },
  { versionKey: false, timestamps: false }
);

userSchema.post('save', handleSaveError);
userSchema.post('findOneAndUpdate', handleSaveError);
const User = model('user', userSchema);

export default User;
