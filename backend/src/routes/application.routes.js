import express from "express";
import {
  getAllApplications,
  getDriveApplications,
  getApplicationDetails,
  updateStatus,
  markAttendance,
  markRoundAttendance,
  updateRating,
  updateFinalStage,
  getStudentApplicationsAdmin,
} from "../controllers/application.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Admin - filter all applications
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllApplications
);

// Get single application details (auth required - student/recruiter/admin)
router.get(
  "/:id",
  protect,
  getApplicationDetails
);

// Recruiter - see drive applicants
router.get(
  "/drive/:driveId",
  protect,
  authorizeRoles("recruiter"),
  getDriveApplications
);

// Recruiter & Admin - update status
router.put(
  "/:id/status",
  protect,
  authorizeRoles("recruiter", "admin"),
  updateStatus
);

router.put(
  "/:id/attendance",
  protect,
  authorizeRoles("recruiter"),
  markAttendance
);

router.put(
  "/:id/round/:roundIndex/attendance",
  protect,
  authorizeRoles("recruiter"),
  markRoundAttendance
);

router.put(
  "/:id/rating",
  protect,
  authorizeRoles("recruiter"),
  updateRating
);

router.put(
  "/:id/final-stage",
  protect,
  authorizeRoles("recruiter"),
  updateFinalStage
);

// Admin - see particular student applications
router.get(
  "/student/:id",
  protect,
  authorizeRoles("admin"),
  getStudentApplicationsAdmin
);

export default router;