import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";

const generateMemberId = async () => {
  let memberId = "";
  let exists = true;

  while (exists) {
    memberId = Math.floor(1000 + Math.random() * 9000).toString();
    // eslint-disable-next-line no-await-in-loop
    const user = await User.findOne({ memberId }).select("_id");
    exists = Boolean(user);
  }

  return memberId;
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const memberId = await generateMemberId();
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      memberId,
      role: role === "Admin" ? "Admin" : "Member"
    });

    return res.status(201).json({
      token: generateToken({ userId: user._id }),
      user: {
        id: user._id,
        memberId: user.memberId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.memberId) {
      user.memberId = await generateMemberId();
      await user.save();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: generateToken({ userId: user._id }),
      user: {
        id: user._id,
        memberId: user.memberId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Login failed" });
  }
};
