import express from "express";
import {
  createDrive,
  getAllDrives,
  getDriveById,
  updateDrive,
  deleteDrive,
  getCompanyDrives,
  getRecruiterDrives,
  getRecruiterCompanies,
} from "../controllers/drive.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Recruiter - get their company drives (MUST be before /:id route)
router.get(
  "/my/drives",
  protect,
  authorizeRoles("recruiter"),
  getRecruiterDrives
);

// Recruiter - get assigned companies
router.get(
  "/my/companies",
  protect,
  authorizeRoles("recruiter"),
  getRecruiterCompanies
);

// Recruiter - get company drives by companyId (MUST be before /:id route)
router.get(
  "/company/:companyId",
  protect,
  authorizeRoles("recruiter"),
  getCompanyDrives
);

// Public - students can view drives
router.get("/", getAllDrives);

// Public - get drive by ID
router.get("/:id", getDriveById);

// Create drive - Admin or Recruiter
router.post(
  "/",
  protect,
  authorizeRoles("admin", "recruiter"),
  createDrive
);

// Update drive - Admin or Recruiter
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "recruiter"),
  updateDrive
);

// Delete drive - Admin or Recruiter
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "recruiter"),
  deleteDrive
);

export default router;
