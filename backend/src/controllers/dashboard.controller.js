import User from "../models/User.model.js";
import Company from "../models/Company.model.js";
import Drive from "../models/Drive.model.js";
import Application from "../models/Application.model.js";
import { asyncHandler } from "../middleware/async.middleware.js";

// Admin Dashboard
export const getAdminDashboard = asyncHandler(async (req, res) => {
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalCompanies = await Company.countDocuments();
  const totalDrives = await Drive.countDocuments();
  const totalApplications = await Application.countDocuments();
  const selected = await Application.countDocuments({ status: "Selected" });
  const rejected = await Application.countDocuments({ status: "Rejected" });

  res.json({
    totalStudents,
    totalCompanies,
    totalDrives,
    totalApplications,
    selected,
    rejected,
  });
});

// Recruiter Dashboard
export const getRecruiterDashboard = asyncHandler(async (req, res) => {
  console.log("Recruiter ID:", req.user._id);
  // Find company where this user is a recruiter
  const company = await Company.findOne({
    recruiters: req.user._id,
  });

  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  console.log("Company found:", company);
  const totalApplicants = await Application.countDocuments({
    company: company._id,
  });
  const shortlisted = await Application.countDocuments({
    company: company._id,
    status: "Shortlisted",
  });
  const selected = await Application.countDocuments({
    company: company._id,
    status: "Selected",
  });
  const rejected = await Application.countDocuments({
    company: company._id,
    status: "Rejected",
  });

  console.log("Total Applicants:", totalApplicants);
  console.log("Shortlisted:", shortlisted);
  console.log("Selected:", selected);
  console.log("Rejected:", rejected);

  res.json({ totalApplicants, shortlisted, selected, rejected });
});

// Student Dashboard
export const getStudentDashboard = asyncHandler(async (req, res) => {
  const totalApplied = await Application.countDocuments({
    student: req.user._id,
  });

  const selected = await Application.countDocuments({
    student: req.user._id,
    status: "Selected",
  });

  res.json({ totalApplied, selected });
});