import express from "express";
import {
  createCompany,
  getAllCompanies,
  getSingleCompany,
  updateCompany,
  deleteCompany,
  assignRecruiter,
  removeRecruiter,
} from "../controllers/company.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Admin only
router.use(protect, authorizeRoles("admin"));

router.post("/", createCompany);
router.get("/", getAllCompanies);
router.get("/:id", getSingleCompany);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

// Recruiter assignment
router.post("/:companyId/assign-recruiter", assignRecruiter);
router.post("/:companyId/remove-recruiter", removeRecruiter);

export default router;