import mongoose from "mongoose";

const roundSchema = new mongoose.Schema(
  {
    name: {
      type: String, // Round 1, HR, Final
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const driveSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    jobRole: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    qualification: {
      type: String,
      required: true,
    },

    vacancies: {
      type: Number,
      required: false,
    },

    location: {
      type: String,
      required: true,
    },

    package: {
      type: String,
    },

    deadline: {
      type: Date,
      required: true,
    },

    rounds: [roundSchema],

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
      required: true,
    },
  },
  { timestamps: true }
);

const Drive = mongoose.model("Drive", driveSchema);

export default Drive;
