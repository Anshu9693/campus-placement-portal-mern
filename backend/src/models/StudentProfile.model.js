import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    image: {
      url: String,
      fileId: String, // ImageKit fileId
    },

    phone: {
      type: String,
      required: false,
      default: "",
    },

    rollNumber: {
      type: String,
      required: false,
      default: "",
    },

    registrationId: {
      type: String,
      required: false,
      default: "",
    },

    course: {
      type: String,
      required: false,
      default: "",
    },

    college: {
      type: String,
      required: false,
      default: "",
    },

    year: {
      type: Number,
      required: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    resume: {
      url: String,
      fileId: String, // ImageKit fileId
    },
  },
  { timestamps: true }
);

const StudentProfile = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);

export default StudentProfile;