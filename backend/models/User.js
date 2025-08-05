// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "moderator", "admin"],
    default: "user",
  },
  history: [
    {
      route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
      date: String,
      seat: Number,
    },
  ],
});

export default mongoose.model("User", userSchema);