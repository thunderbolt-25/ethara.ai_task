import express from "express";
import { getUsers } from "../controllers/userController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, allowRoles("Admin"), getUsers);

export default router;
