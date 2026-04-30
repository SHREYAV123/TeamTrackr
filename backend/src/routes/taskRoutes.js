import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// Create a task (Admin & Member)
router.post("/", protect, authorize(["Admin", "Member"]), createTask);

// Get tasks for a project (Admin & Member)
router.get("/:projectId", protect, getTasks);

// Update task status (Assigned user or Admin)
router.put("/:id/status", protect, updateTaskStatus);

// Delete a task (Admin only)
router.delete("/:id", protect, authorize(["Admin"]), deleteTask);

export default router;
