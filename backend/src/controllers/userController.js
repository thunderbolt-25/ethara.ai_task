import User from "../models/User.js";

export const getUsers = async (req, res) => {
  const users = await User.find({})
    .select("name email role memberId")
    .sort({ createdAt: -1 });

  res.json(users);
};
