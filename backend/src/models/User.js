import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    profilePic: {
      type: String,
      default: ''
    },
    wallpaper: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('User', userSchema);
