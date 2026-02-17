import Application from "../models/Application.model.js";
import Drive from "../models/Drive.model.js";
import Company from "../models/Company.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import { asyncHandler } from "../middleware/async.middleware.js";

export const getAllApplications = asyncHandler(async (req, res) => {
  const { status, company, jobRole, dateFrom, dateTo } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (company) filter.company = company;
  
  if (jobRole) {
    const drives = await Drive.find({ jobRole });
    filter.drive = { $in: drives.map((d) => d._id) };
  }
  
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);
  }

  const applications = await Application.find(filter)
    .populate("student drive company")
    .lean()
    .sort({ createdAt: -1 });

  // Fetch profile info for each student
  const applicationsWithProfiles = await Promise.all(
    applications.map(async (app) => {
      const profile = await StudentProfile.findOne({ user: app.student._id }).lean();
      return {
        ...app,
        student: {
          ...app.student,
          profile,
        },
      };
    })
  );

  res.json(applicationsWithProfiles);
});

export const getDriveApplications = asyncHandler(async (req, res) => {
  const { driveId } = req.params;

  const drive = await Drive.findById(driveId).populate("company");
  if (!drive) {
    return res.status(404).json({ message: "Drive not found" });
  }

  // Check if company exists
  if (!drive.company) {
    return res.status(404).json({ message: "Company not found for this drive" });
  }

  // Verify recruiter belongs to this company
  const isRecruiterForCompany = drive.company.recruiters.includes(
    req.user._id
  );
  if (!isRecruiterForCompany) {
    return res.status(403).json({
      message: "You don't have access to this drive",
    });
  }

  const applications = await Application.find({
    drive: driveId,
  }).populate("student").lean();

  // Fetch profile info for each student
  const applicationsWithProfiles = await Promise.all(
    applications.map(async (app) => {
      const profile = await StudentProfile.findOne({ user: app.student._id }).lean();
      return {
        ...app,
        student: {
          ...app.student,
          profile,
        },
      };
    })
  );

  res.json(applicationsWithProfiles);
});

export const getApplicationDetails = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate("student")
    .populate("drive")
    .populate("company")
    .lean();

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  // Authorization check - student can only see their own, recruiter/admin can see all
  if (
    req.user.role === "student" &&
    application.student._id.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Fetch student profile
  const profile = await StudentProfile.findOne({ user: application.student._id }).lean();
  
  const applicationWithProfile = {
    ...application,
    student: {
      ...application.student,
      profile,
    },
  };

  res.json(applicationWithProfile);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const updated = await Application.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, currentRound: req.body.currentRound },
    { new: true }
  );
  res.json(updated);
});

export const markRoundAttendance = asyncHandler(async (req, res) => {
  const { roundIndex, attendance } = req.body;

  const application = await Application.findById(req.params.id);
  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  if (!application.rounds[roundIndex]) {
    return res.status(400).json({ message: "Round not found" });
  }

  application.rounds[roundIndex].attendance = attendance;
  await application.save();

  res.json(application);
});

export const markAttendance = asyncHandler(async (req, res) => {
  const updated = await Application.findByIdAndUpdate(
    req.params.id,
    { attendance: req.body.attendance },
    { new: true }
  );
  res.json(updated);
});

export const updateRating = asyncHandler(async (req, res) => {
  const updated = await Application.findByIdAndUpdate(
    req.params.id,
    { rating: req.body.rating, recruiterNotes: req.body.notes },
    { new: true }
  );
  res.json(updated);
});

export const updateFinalStage = asyncHandler(async (req, res) => {
  const updated = await Application.findByIdAndUpdate(
    req.params.id,
    { finalStage: req.body.finalStage },
    { new: true }
  );
  res.json(updated);
});

export const getStudentApplicationsAdmin = asyncHandler(async (req, res) => {
  const applications = await Application.find({
    student: req.params.id,
  }).populate("drive company");

  res.json(applications);
});