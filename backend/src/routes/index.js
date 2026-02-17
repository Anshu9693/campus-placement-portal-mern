import express from "express";

import authRoutes from "./auth.routes.js";
import studentRoutes from "./student.routes.js";
import companyRoutes from "./company.routes.js";
import driveRoutes from "./drive.routes.js";
import applicationRoutes from "./application.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/companies", companyRoutes);
router.use("/drives", driveRoutes);
router.use("/applications", applicationRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;