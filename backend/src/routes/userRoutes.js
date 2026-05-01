import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { getUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, authorize(["Admin"]), getUsers);

export default router;
