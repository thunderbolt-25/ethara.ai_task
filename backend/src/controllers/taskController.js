import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

export const createTask = async (req, res) => {
  const { title, description, projectId, assignedTo, status, dueDate } = req.body;

  if (!title || !projectId || !assignedTo || !dueDate) {
    return res.status(400).json({ message: "title, projectId, assignedTo and dueDate are required" });
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const projectMemberIds = project.teamMembers.map((id) => id.toString());

  const requesterInProject = projectMemberIds.includes(req.user._id.toString());
  if (!requesterInProject && req.user.role !== "Admin") {
    return res.status(403).json({ message: "You are not part of this project" });
  }

  const assignee = await User.findOne({ memberId: assignedTo }).select("_id memberId");
  if (!assignee) {
    return res.status(400).json({ message: "Invalid member ID. Enter a valid 4-digit member ID" });
  }

  if (!projectMemberIds.includes(assignee._id.toString()) && req.user.role !== "Admin") {
    return res.status(400).json({ message: "Assignee must be a project member" });
  }

  const task = await Task.create({
    title,
    description,
    project: projectId,
    assignedTo: assignee._id,
    createdBy: req.user._id,
    status: status || "Todo",
    dueDate
  });

  res.status(201).json(task);
};

export const getTasks = async (req, res) => {
  const filter = req.user.role === "Admin" ? {} : { assignedTo: req.user._id };
  const tasks = await Task.find(filter)
    .populate("project", "name")
    .populate("assignedTo", "name email memberId")
    .sort({ dueDate: 1 });

  res.json(tasks);
};

export const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status, dueDate, title, description, assignedTo } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.assignedTo.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
    return res.status(403).json({ message: "You cannot update this task" });
  }

  if (status) task.status = status;
  if (dueDate) task.dueDate = dueDate;
  if (title && req.user.role === "Admin") task.title = title;
  if (typeof description === "string" && req.user.role === "Admin") task.description = description;

  if (assignedTo && req.user.role === "Admin") {
    const assignee = await User.findOne({ memberId: assignedTo }).select("_id");
    if (!assignee) {
      return res.status(400).json({ message: "Invalid member ID. Enter a valid 4-digit member ID" });
    }
    task.assignedTo = assignee._id;
  }

  await task.save();

  res.json(task);
};
