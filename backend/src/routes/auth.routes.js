import express from "express";
import {
  registerStudent,
  loginUser,
  createRecruiter,
  createAdmin,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Public
router.post("/register", registerStudent);
router.post("/login", loginUser);

// Admin only
router.post(
  "/create-recruiter",
  protect,
  authorizeRoles("admin"),
  createRecruiter
);

// Super Admin only (optional if you want)
router.post(
  "/create-admin",
  protect,
  authorizeRoles("admin"),
  createAdmin
);

export default router;