import express from "express";
import {
  getProfile,
  updateProfile,
  uploadResume,
  uploadImage,
  getActiveDrives,
  applyToDrive,
  getMyApplications,
  getAllStudents,
  getAllRecruiters,
  updateStudentStatus, // Added the missing import
  deleteRecruiter, // Added the missing import
} from "../controllers/student.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { uploadResumeMiddleware, uploadImageMiddleware, uploadToImageKit } from "../middleware/upload.middleware.js";

const router = express.Router();

// Admin only - Get all students
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllStudents
);

// Admin only - Get all recruiters
router.get(
  "/recruiters/list",
  protect,
  authorizeRoles("admin"),
  getAllRecruiters
);

// Admin only - Delete a recruiter
router.delete(
  "/recruiters/:id",
  authorizeRoles("admin"),
  deleteRecruiter
);

// All student routes protected
router.use(protect, authorizeRoles("student"));

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/upload-resume", uploadResumeMiddleware, uploadToImageKit, uploadResume);
router.post("/upload-image", uploadImageMiddleware, uploadToImageKit, uploadImage);

router.get("/drives", getActiveDrives);
router.post("/apply/:driveId", applyToDrive);

router.get("/applications", getMyApplications);

// Admin only - Update student status
router.put("/:id/status", protect, authorizeRoles("admin"), updateStudentStatus);

export default router;