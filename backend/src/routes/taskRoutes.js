import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTask,
  getTasks,
  updateTaskStatus,
} from "../controllers/taskController.js";

const router = express.Router();

// Create a task (Admin only)
router.post("/", protect, createTask);

// Get tasks for a project (Admin & Member)
router.get("/:projectId", protect, getTasks);

// Update task status (Assigned user or Admin)
router.put("/:id/status", protect, updateTaskStatus);

export default router;
