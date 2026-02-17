import express from "express";
import {
  getAdminDashboard,
  getRecruiterDashboard,
  getStudentDashboard,
} from "../controllers/dashboard.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Admin
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  getAdminDashboard
);

// Recruiter
router.get(
  "/recruiter",
  protect,
  authorizeRoles("recruiter"),
  getRecruiterDashboard
);

// Student
router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentDashboard
);

export default router;