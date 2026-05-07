import Project from "../models/Project.js";
import User from "../models/User.js";

export const createProject = async (req, res) => {
  const { name, description, teamMembers = [] } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Project name is required" });
  }

  const validUsers = await User.find({ _id: { $in: teamMembers } }).select("_id");
  const memberIds = validUsers.map((u) => u._id.toString());
  if (!memberIds.includes(req.user._id.toString())) {
    memberIds.push(req.user._id.toString());
  }

  const project = await Project.create({
    name,
    description,
    createdBy: req.user._id,
    teamMembers: memberIds
  });

  res.status(201).json(project);
};

export const getProjects = async (req, res) => {
  const projects = await Project.find({ teamMembers: req.user._id })
    .populate("teamMembers", "name email role memberId")
    .sort({ createdAt: -1 });

  res.json(projects);
};

export const addMemberToProject = async (req, res) => {
  const { projectId } = req.params;
  const { userId, memberId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (project.createdBy.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
    return res.status(403).json({ message: "Only project owner or admin can add members" });
  }

  let memberUserId = userId;
  if (!memberUserId && memberId) {
    const user = await User.findOne({ memberId }).select("_id");
    if (!user) return res.status(404).json({ message: "Member not found" });
    memberUserId = user._id.toString();
  }

  if (!memberUserId) {
    return res.status(400).json({ message: "userId or memberId is required" });
  }

  if (!project.teamMembers.map((id) => id.toString()).includes(memberUserId)) {
    project.teamMembers.push(memberUserId);
    await project.save();
  }

  const populated = await project.populate("teamMembers", "name email role memberId");
  res.json({ message: "Member added", project: populated });
};

export const removeMemberFromProject = async (req, res) => {
  const { projectId } = req.params;
  const { userId, memberId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: "Project not found" });

  if (project.createdBy.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
    return res.status(403).json({ message: "Only project owner or admin can remove members" });
  }

  let memberUserId = userId;
  if (!memberUserId && memberId) {
    const user = await User.findOne({ memberId }).select("_id");
    if (!user) return res.status(404).json({ message: "Member not found" });
    memberUserId = user._id.toString();
  }

  if (!memberUserId) {
    return res.status(400).json({ message: "userId or memberId is required" });
  }

  if (project.createdBy.toString() === memberUserId) {
    return res.status(400).json({ message: "Project owner cannot be removed" });
  }

  project.teamMembers = project.teamMembers.filter((id) => id.toString() !== memberUserId);
  await project.save();

  const populated = await project.populate("teamMembers", "name email role memberId");
  res.json({ message: "Member removed", project: populated });
};

export const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: "Project not found" });

  if (project.createdBy.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
    return res.status(403).json({ message: "Only project owner or admin can update project" });
  }

  if (name) project.name = name;
  if (typeof description === "string") project.description = description;
  await project.save();

  res.json(project);
};

export const deleteProject = async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: "Project not found" });

  if (project.createdBy.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
    return res.status(403).json({ message: "Only project owner or admin can delete project" });
  }

  await project.deleteOne();
  res.json({ message: "Project deleted" });
};
