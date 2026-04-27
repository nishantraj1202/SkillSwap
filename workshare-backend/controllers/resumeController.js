/**
 * ─────────────────────────────────────────────
 *  WorkShare Backend — Resume Controller
 * ─────────────────────────────────────────────
 *  Handles the business logic for:
 *    1. Uploading a resume
 *    2. Extracting text from it
 *    3. Sending it to AI for analysis
 *    4. Saving the results to MongoDB
 *    5. Fetching past analyses
 */

const path = require("path");
const Resume = require("../models/Resume");
const extractText = require("../helpers/parseResume");
const analyzeResume = require("../helpers/analyzeResume");

// ─── POST /api/resume/upload-resume ──────────────────────────────────
// Accepts a resume file, extracts text, runs AI analysis, saves to DB.
const uploadAndAnalyze = async (req, res) => {
  try {
    // 1. Validate that a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please attach a PDF or DOCX resume.",
      });
    }

    // 2. Validate that a userId was provided
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required in the request body.",
      });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    console.log(`📄  Received resume: ${req.file.originalname} (${mimeType})`);

    // 3. Extract text from the resume
    console.log("🔍  Extracting text...");
    const extractedText = await extractText(filePath, mimeType);

    if (!extractedText || extractedText.length < 50) {
      return res.status(422).json({
        success: false,
        message:
          "Could not extract meaningful text from the resume. Please upload a valid file.",
      });
    }

    // 4. Send to AI for analysis
    console.log("🤖  Analyzing resume with AI...");
    const analysis = await analyzeResume(extractedText);

    // 5. Save everything to MongoDB
    const resume = await Resume.create({
      userId,
      originalName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      fileType: mimeType,
      extractedText,
      score: analysis.score,
      skills: analysis.skills,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      suggestions: analysis.suggestions,
    });

    console.log(`✅  Resume analyzed & saved (ID: ${resume._id})`);

    // 6. Return the analysis to the client
    return res.status(201).json({
      success: true,
      message: "Resume uploaded and analyzed successfully.",
      data: {
        resumeId: resume._id,
        score: analysis.score,
        skills: analysis.skills,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        suggestions: analysis.suggestions,
      },
    });
  } catch (error) {
    console.error("❌  Resume upload/analysis error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

// ─── GET /api/resume/:userId ─────────────────────────────────────────
// Fetch all past resume analyses for a specific user.
const getResumesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const resumes = await Resume.find({ userId })
      .sort({ createdAt: -1 })
      .select("-extractedText"); // exclude bulky text from list view

    return res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    console.error("❌  Fetch resumes error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

// ─── GET /api/resume/detail/:resumeId ────────────────────────────────
// Fetch full details of a single resume analysis.
const getResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error("❌  Fetch resume detail error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

module.exports = {
  uploadAndAnalyze,
  getResumesByUser,
  getResumeById,
};
