import express from "express";
import {
  createProject,
  getProjects,
  addMemberToProject,
  removeMemberFromProject,
  updateProject,
  deleteProject
} from "../controllers/projectController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getProjects);
router.post("/", protect, allowRoles("Admin"), createProject);
router.patch("/:projectId/members", protect, addMemberToProject);
router.patch("/:projectId", protect, allowRoles("Admin"), updateProject);
router.delete("/:projectId", protect, allowRoles("Admin"), deleteProject);
router.delete("/:projectId/members", protect, allowRoles("Admin"), removeMemberFromProject);

export default router;
