import StudentProfile from "../models/StudentProfile.model.js";
import Drive from "../models/Drive.model.js";
import Application from "../models/Application.model.js";
import User from "../models/User.model.js";
import Company from "../models/Company.model.js";
import { asyncHandler } from "../middleware/async.middleware.js";

// Get Profile
export const getProfile = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id }).populate(
    "user",
    "email name"
  );

  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  const profileObj = profile.toObject();
  const { user, ...safeProfile } = profileObj;
  res.json({
    ...safeProfile,
    email: user?.email || "",
    name: user?.name || "",
  });
});

// Update Profile
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "phone",
    "rollNumber",
    "registrationId",
    "course",
    "college",
    "year",
    "skills",
    "image",
    "resume",
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const updated = await StudentProfile.findOneAndUpdate(
    { user: req.user._id },
    updates,
    { new: true }
  );
  res.json(updated);
});

// Upload Resume (after ImageKit middleware)
export const uploadResume = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });

  profile.resume = {
    url: req.uploadedFile.url,
    fileId: req.uploadedFile.fileId,
  };

  await profile.save();
  res.json({ success: true, resume: profile.resume });
});

// Upload Image (after ImageKit middleware)
export const uploadImage = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });

  profile.image = {
    url: req.uploadedFile.url,
    fileId: req.uploadedFile.fileId,
  };

  await profile.save();
  res.json({ success: true, image: profile.image });
});

// Get Active Drives
export const getActiveDrives = asyncHandler(async (req, res) => {
  const drives = await Drive.find({ isActive: true }).populate("company");
  res.json(drives);
});

// Apply to Drive
export const applyToDrive = asyncHandler(async (req, res) => {
  const { driveId } = req.params;

  const drive = await Drive.findById(driveId);
  if (!drive) return res.status(404).json({ message: "Drive not found" });

  // Check if drive is active
  if (!drive.isActive) {
    return res.status(400).json({ message: "Drive is not active" });
  }

  // Check if application deadline has passed
  if (new Date() > drive.deadline) {
    return res.status(400).json({ message: "Application deadline has passed" });
  }

  // Check if student already applied
  const existingApplication = await Application.findOne({
    student: req.user._id,
    drive: driveId,
  });

  if (existingApplication) {
    return res.status(400).json({
      message: "You have already applied to this drive",
    });
  }

  // Check if student profile is complete
  const profile = await StudentProfile.findOne({ user: req.user._id });

  if (
    !profile.phone ||
    !profile.course ||
    !profile.college ||
    !profile.resume?.url
  ) {
    return res.status(400).json({
      message:
        "Please complete your profile with phone, course, college, and resume before applying",
    });
  }

  const application = await Application.create({
    student: req.user._id,
    drive: drive._id,
    company: drive.company,
  });

  res.status(201).json(application);
});

// Get My Applications
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({
    student: req.user._id,
  }).populate("drive company");

  res.json(applications);
});

// Admin - Get All Students
export const getAllStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: "student" })
    .select("-password")
    .lean();

  // Get profile info for each student
  const studentsWithProfile = await Promise.all(
    students.map(async (student) => {
      const profile = await StudentProfile.findOne({ user: student._id }).lean();
      return {
        ...student,
        profile,
      };
    })
  );

  res.json(studentsWithProfile);
});

// Admin - Get All Recruiters
export const getAllRecruiters = asyncHandler(async (req, res) => {
  try {
    console.log("Fetching recruiters from database...");
    const recruiters = await User.find({ role: "recruiter" })
      .select("-password")
      .lean();

    console.log("Recruiters fetched:", recruiters);

    if (!recruiters || recruiters.length === 0) {
      console.log("No recruiters found in the database.");
      return res.status(404).json({ message: "No recruiters found" });
    }

    res.json(recruiters);
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    res.status(500).json({ message: "Failed to fetch recruiters" });
  }
});

// Update Student Status
export const updateStudentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const student = await User.findById(id);
  if (!student || student.role !== "student") {
    return res.status(404).json({ message: "Student not found" });
  }

  student.isActive = isActive;
  await student.save();

  res.json({ success: true, message: "Student status updated successfully" });
});

// Delete Recruiter
export const deleteRecruiter = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const recruiter = await User.findById(id);
  if (!recruiter || recruiter.role !== "recruiter") {
    return res.status(404).json({ message: "Recruiter not found" });
  }

  // Cleanup recruiter references from companies before deleting user
  await Company.updateMany(
    { recruiters: recruiter._id },
    { $pull: { recruiters: recruiter._id } }
  );

  await User.findByIdAndDelete(id);
  res.status(200).json({ message: "Recruiter deleted successfully" });
});
