/**
 * ─────────────────────────────────────────────
 *  WorkShare Backend — Resume Routes
 * ─────────────────────────────────────────────
 *  Maps HTTP endpoints to controller functions.
 *
 *  POST   /api/resume/upload-resume   → Upload & analyse a resume
 *  GET    /api/resume/:userId         → List all resumes for a user
 *  GET    /api/resume/detail/:resumeId→ Get full analysis for one resume
 */

const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const {
  uploadAndAnalyze,
  getResumesByUser,
  getResumeById,
} = require("../controllers/resumeController");

// ── Upload & Analyze ──
// Multer middleware accepts a single file under the field name "resume"
router.post("/upload-resume", upload.single("resume"), uploadAndAnalyze);

// ── Fetch all resumes for a user ──
router.get("/:userId", getResumesByUser);

// ── Fetch a single resume detail ──
router.get("/detail/:resumeId", getResumeById);

module.exports = router;
