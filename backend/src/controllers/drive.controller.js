import Drive from "../models/Drive.model.js";
import { asyncHandler } from "../middleware/async.middleware.js";

export const createDrive = asyncHandler(async (req, res) => {
  // For recruiters, automatically set the company to their assigned company
  let driveData = { ...req.body, createdBy: req.user._id };
  
  if (req.user.role === 'recruiter') {
    const Company = (await import("../models/Company.model.js")).default;
    const company = await Company.findOne({
      recruiters: req.user._id,
    });
    
    if (!company) {
      return res.status(403).json({ message: "You are not assigned to any company" });
    }
    
    driveData.company = company._id;
  }

  // If rounds is a number or string number, convert it to an array of round objects
  if (driveData.rounds) {
    const numRounds = Number(driveData.rounds);
    if (!isNaN(numRounds) && numRounds > 0) {
      driveData.rounds = Array.from({ length: numRounds }, (_, i) => ({
        name: `Round ${i + 1}`,
        order: i + 1,
      }));
    }
  }
  
  const drive = await Drive.create(driveData);
  res.status(201).json(drive);
});

export const getAllDrives = asyncHandler(async (req, res) => {
  const drives = await Drive.find().populate("company");
  res.json(drives);
});

export const getDriveById = asyncHandler(async (req, res) => {
  const drive = await Drive.findById(req.params.id).populate("company");
  res.json(drive);
});

export const updateDrive = asyncHandler(async (req, res) => {
  // For recruiters, check if they own this drive (company match)
  const drive = await Drive.findById(req.params.id);
  
  if (!drive) {
    return res.status(404).json({ message: "Drive not found" });
  }
  
  if (req.user.role === 'recruiter') {
    const Company = (await import("../models/Company.model.js")).default;
    const company = await Company.findOne({
      recruiters: req.user._id,
    });
    
    if (!company || drive.company.toString() !== company._id.toString()) {
      return res.status(403).json({ message: "You can only update drives from your company" });
    }
  }

  // If rounds is a number, convert it to an array of round objects
  if (typeof req.body.rounds === 'number') {
    const numberOfRounds = req.body.rounds;
    req.body.rounds = Array.from({ length: numberOfRounds }, (_, i) => ({
      name: `Round ${i + 1}`,
      order: i + 1,
    }));
  }
  
  const updated = await Drive.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

export const deleteDrive = asyncHandler(async (req, res) => {
  // For recruiters, check if they own this drive (company match)
  const drive = await Drive.findById(req.params.id);
  
  if (!drive) {
    return res.status(404).json({ message: "Drive not found" });
  }
  
  if (req.user.role === 'recruiter') {
    const Company = (await import("../models/Company.model.js")).default;
    const company = await Company.findOne({
      recruiters: req.user._id,
    });
    
    if (!company || drive.company.toString() !== company._id.toString()) {
      return res.status(403).json({ message: "You can only delete drives from your company" });
    }
  }
  
  await Drive.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export const getCompanyDrives = asyncHandler(async (req, res) => {
  const drives = await Drive.find({
    company: req.params.companyId,
  });
  res.json(drives);
});

export const getRecruiterDrives = asyncHandler(async (req, res) => {
  const Company = (await import("../models/Company.model.js")).default;
  
  // Find company where this user is a recruiter
  const company = await Company.findOne({
    recruiters: req.user._id,
  });

  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  const drives = await Drive.find({
    company: company._id,
  }).populate("company");

  res.json(drives);
});