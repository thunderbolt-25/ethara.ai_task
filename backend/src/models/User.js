import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    memberId: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{4}$/
    },
    role: { type: String, enum: ["Admin", "Member"], default: "Member" }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
