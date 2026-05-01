import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  createTask,
  getTasks,
  getMyTasks,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// Create a task (Admin only)
router.post("/", protect, authorize(["Admin"]), createTask);

// Get tasks assigned to current user (Admin & Member)
router.get("/my/tasks", protect, authorize(["Admin", "Member"]), getMyTasks);

// Get tasks for a project (Admin & Member)
router.get("/:projectId", protect, getTasks);

// Update task status (Assigned user or Admin)
router.put("/:id/status", protect, updateTaskStatus);

// Delete a task (Admin only)
router.delete("/:id", protect, authorize(["Admin"]), deleteTask);

export default router;
