import multer from "multer";
import imagekit from "../config/imagekit.js";

// Store file in memory
const storage = multer.memoryStorage();

// Resume upload - accepts PDF only
const resumeUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

// Image upload - accepts image files only
const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, GIF files are allowed"), false);
    }
    cb(null, true);
  },
});

export const uploadResumeMiddleware = resumeUpload.single("resume");
export const uploadImageMiddleware = imageUpload.single("image");

export const uploadToImageKit = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const isResume = req.file.fieldname === "resume";
    const fileName = isResume
      ? `resume-${Date.now()}.pdf`
      : `profile-${req.user._id}-${Date.now()}.jpg`;
    const folder = isResume ? "/placement-resumes" : "/placement-profiles";

    const uploaded = await imagekit.upload({
      file: req.file.buffer,
      fileName,
      folder,
    });

    req.uploadedFile = {
      url: uploaded.url,
      fileId: uploaded.fileId,
    };

    next();
  } catch (error) {
    console.error("ImageKit Upload Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "File upload failed. Please try again.",
      error: error.message,
    });
  }
};