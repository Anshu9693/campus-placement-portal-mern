import Drive from "../models/Drive.model.js";
import Company from "../models/Company.model.js";
import { asyncHandler } from "../middleware/async.middleware.js";

const toRoundArray = (roundsValue) => {
  const numRounds = Number(roundsValue);
  if (Number.isNaN(numRounds) || numRounds <= 0) {
    return roundsValue;
  }
  return Array.from({ length: numRounds }, (_, i) => ({
    name: `Round ${i + 1}`,
    order: i + 1,
  }));
};

const getRecruiterCompanyIds = async (userId) => {
  const companies = await Company.find({ recruiters: userId }).select("_id");
  return companies.map((company) => company._id.toString());
};

export const createDrive = asyncHandler(async (req, res) => {
  let driveData = { ...req.body, createdBy: req.user._id };

  if (req.user.role === "recruiter") {
    const assignedCompanies = await Company.find({
      recruiters: req.user._id,
    }).select("_id name");

    if (!assignedCompanies.length) {
      return res.status(403).json({ message: "You are not assigned to any company" });
    }

    const assignedIds = assignedCompanies.map((company) => company._id.toString());
    const selectedCompanyId = driveData.company?.toString();

    if (selectedCompanyId) {
      if (!assignedIds.includes(selectedCompanyId)) {
        return res.status(403).json({ message: "You can only create drives for your assigned companies" });
      }
      driveData.company = selectedCompanyId;
    } else if (assignedCompanies.length === 1) {
      driveData.company = assignedCompanies[0]._id;
    } else {
      return res.status(400).json({ message: "Please select a company for this drive" });
    }
  }

  if (driveData.rounds) {
    driveData.rounds = toRoundArray(driveData.rounds);
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
  const drive = await Drive.findById(req.params.id);

  if (!drive) {
    return res.status(404).json({ message: "Drive not found" });
  }

  if (req.user.role === "recruiter") {
    const recruiterCompanyIds = await getRecruiterCompanyIds(req.user._id);
    if (!recruiterCompanyIds.length) {
      return res.status(403).json({ message: "You are not assigned to any company" });
    }

    if (!recruiterCompanyIds.includes(drive.company.toString())) {
      return res.status(403).json({ message: "You can only update drives from your assigned companies" });
    }

    if (req.body.company) {
      const requestedCompanyId = req.body.company.toString();
      if (!recruiterCompanyIds.includes(requestedCompanyId)) {
        return res.status(403).json({ message: "You can only assign drives to your assigned companies" });
      }
    }
  }

  if (req.body.rounds !== undefined) {
    req.body.rounds = toRoundArray(req.body.rounds);
  }

  const updated = await Drive.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).populate("company");
  res.json(updated);
});

export const deleteDrive = asyncHandler(async (req, res) => {
  const drive = await Drive.findById(req.params.id);

  if (!drive) {
    return res.status(404).json({ message: "Drive not found" });
  }

  if (req.user.role === "recruiter") {
    const recruiterCompanyIds = await getRecruiterCompanyIds(req.user._id);
    if (!recruiterCompanyIds.includes(drive.company.toString())) {
      return res.status(403).json({ message: "You can only delete drives from your assigned companies" });
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
  const companies = await Company.find({
    recruiters: req.user._id,
  }).select("_id");

  if (!companies.length) {
    return res.status(404).json({ message: "No companies found for this recruiter" });
  }

  const companyIds = companies.map((company) => company._id);
  const drives = await Drive.find({
    company: { $in: companyIds },
  }).populate("company");

  res.json(drives);
});

export const getRecruiterCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find({ recruiters: req.user._id })
    .select("_id name")
    .sort({ name: 1 });
  res.json(companies);
});
