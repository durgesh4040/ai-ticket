import mongoose from "mongoose";

const userschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "moderator", "admin"],
    default: "user",  
  },
  skills: [String],
  createdAt: {
    type: Date,
    default: Date.now,  
  },
});

const userModel = mongoose.model("User", userschema);
export default userModel;
