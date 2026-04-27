/**
 * ─────────────────────────────────────────────
 *  WorkShare Backend — Resume Model (MongoDB)
 * ─────────────────────────────────────────────
 *  Stores every resume upload along with its
 *  extracted text, AI score, detected skills,
 *  strengths, weaknesses, and suggestions.
 */

const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    // Reference to the user who uploaded the resume
    userId: {
      type: String,
      required: [true, "userId is required"],
      index: true,
    },

    // Original filename uploaded by the user
    originalName: {
      type: String,
      required: true,
    },

    // Server-side path or URL to the stored file
    fileUrl: {
      type: String,
      required: true,
    },

    // Mime type of the uploaded file
    fileType: {
      type: String,
      enum: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      required: true,
    },

    // Raw text extracted from the resume
    extractedText: {
      type: String,
      default: "",
    },

    // AI-generated resume score (0–100)
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    // Skills detected by AI
    skills: {
      type: [String],
      default: [],
    },

    // Strengths identified by AI
    strengths: {
      type: [String],
      default: [],
    },

    // Weaknesses identified by AI
    weaknesses: {
      type: [String],
      default: [],
    },

    // Actionable suggestions from AI
    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
