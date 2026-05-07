import express from "express";
import { createTask, getTasks, updateTaskStatus } from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTasks);
router.post("/", protect, createTask);
router.patch("/:taskId/status", protect, updateTaskStatus);

export default router;
