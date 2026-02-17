import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drive",
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Shortlisted",
        "Interview Scheduled",
        "Interviewed",
        "Selected",
        "Rejected",
        "On Hold",
      ],
      default: "Applied",
    },

    currentRound: {
      type: String,
    },

    rounds: [
      {
        name: String, // Round 1, Round 2, HR, Final
        attendance: {
          type: String,
          enum: ["Present", "Absent", "Not Scheduled"],
        },
        status: {
          type: String,
          enum: ["Pending", "Passed", "Failed"],
        },
        interviewDate: Date,
        feedback: String,
        _id: false,
      },
    ],

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    recruiterNotes: {
      type: String,
    },

    finalStage: {
      type: String,
      enum: ["LOI Issued", "Offer Released"],
    },
  },
  { timestamps: true }
);

/* Prevent duplicate application */
applicationSchema.index({ student: 1, drive: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;