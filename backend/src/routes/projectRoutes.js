import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  createProject,
  getProjects,
  addMember,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

// Admin only can create projects
router.post("/", protect, authorize(["Admin"]), createProject);

// Both Admin and Member can view projects
router.get("/", protect, getProjects);

// Admin can add members to a project
router.post("/:id/members", protect, authorize(["Admin"]), addMember);

// Admin can delete a project (also deletes all its tasks)
router.delete("/:id", protect, authorize(["Admin"]), deleteProject);

export default router;
