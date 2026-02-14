import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    password1: { type: String },
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// This line ensures we use the existing model if it exists, 
// otherwise we create a new one.
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;