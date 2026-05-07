import Task from "../models/Task.js";

export const getDashboard = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id }).lean();
  const now = new Date();

  const summary = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "Todo").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    done: tasks.filter((t) => t.status === "Done").length,
    overdue: tasks.filter((t) => t.status !== "Done" && new Date(t.dueDate) < now).length
  };

  res.json(summary);
};
