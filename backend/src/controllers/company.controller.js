import Company from "../models/Company.model.js";
import Drive from "../models/Drive.model.js";
import Application from "../models/Application.model.js";
import { asyncHandler } from "../middleware/async.middleware.js";

export const createCompany = asyncHandler(async (req, res) => {
  const company = await Company.create({
    ...req.body,
    createdBy: req.user._id,
  });
  res.status(201).json(company);
});

export const getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().populate("recruiters");
  res.json(companies);
});

export const getSingleCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate("recruiters");
  res.json(company);
});

export const updateCompany = asyncHandler(async (req, res) => {
  const updated = await Company.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).populate("recruiters");
  res.json(updated);
});

export const deleteCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const company = await Company.findById(id);
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  // Delete all drives linked to this company
  const drives = await Drive.find({ company: id }).select("_id");
  const driveIds = drives.map((drive) => drive._id);

  if (driveIds.length) {
    await Application.deleteMany({ drive: { $in: driveIds } });
    await Drive.deleteMany({ _id: { $in: driveIds } });
  }

  // Cleanup any remaining company-linked applications and delete company
  await Application.deleteMany({ company: id });
  await Company.findByIdAndDelete(id);

  res.json({ success: true, message: "Company and related drives deleted" });
});

export const assignRecruiter = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  const { recruiterId } = req.body;

  const company = await Company.findById(companyId);
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  // Check if recruiter already assigned
  if (!company.recruiters.includes(recruiterId)) {
    company.recruiters.push(recruiterId);
    await company.save();
  }

  await company.populate("recruiters");
  res.json(company);
});

export const removeRecruiter = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  const { recruiterId } = req.body;

  const company = await Company.findById(companyId);
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  company.recruiters = company.recruiters.filter(
    (id) => id.toString() !== recruiterId
  );
  await company.save();
  await company.populate("recruiters");

  res.json(company);
});
