const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// ── AI Career Coach Routes ──

// POST /api/ai/generate-project  → Generates a project roadmap
router.post("/generate-project", aiController.generateProject);

// POST /api/ai/review-project    → Reviews a student project
router.post("/review-project", aiController.reviewProject);

module.exports = router;
