/**
 * ═══════════════════════════════════════════════
 *  WorkShare Backend — Express Server Entry Point
 * ═══════════════════════════════════════════════
 *
 *  Initialises:
 *    1. Environment variables (dotenv)
 *    2. Express app with CORS & JSON parsing
 *    3. MongoDB connection
 *    4. API routes
 *    5. Global error handler for Multer errors
 *
 *  Run:
 *    npm run dev   (with nodemon, hot-reload)
 *    npm start     (production)
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");

// ── Create Express app ──
const app = express();

// ── Middleware ──
app.use(cors()); // Allow cross-origin requests from the frontend
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ── Serve uploaded files statically ──
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Health-check route ──
app.get("/", (_req, res) => {
  res.json({
    message: "🚀 WorkShare API is running",
    version: "1.0.0",
    endpoints: {
      register: "POST /api/auth/register",
      verifyOtp: "POST /api/auth/verify-otp",
      resendOtp: "POST /api/auth/resend-otp",
      login: "POST /api/auth/login",
      uploadResume: "POST /api/resume/upload-resume",
      getUserResumes: "GET  /api/resume/:userId",
      getResumeDetail: "GET  /api/resume/detail/:resumeId",
    },
  });
});

// ── API Routes ──
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);

// ── Global Error Handler ──
// Catches Multer-specific errors (file too large, wrong type, etc.)
app.use((err, _req, res, _next) => {
  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "File is too large. Maximum allowed size is 5 MB.",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Custom file-filter errors (wrong MIME type)
  if (err.message && err.message.includes("Invalid file type")) {
    return res.status(415).json({
      success: false,
      message: err.message,
    });
  }

  // Catch-all
  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// ── Start Server ──
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀  WorkShare API running on http://localhost:${PORT}`);
    console.log(`🔐  POST /api/auth/register         → Register & send OTP`);
    console.log(`✅  POST /api/auth/verify-otp       → Verify OTP & issue JWT`);
    console.log(`🔁  POST /api/auth/resend-otp       → Resend OTP`);
    console.log(`🔓  POST /api/auth/login            → Login verified user`);
    console.log(`📄  POST /api/resume/upload-resume  → Upload & Analyze`);
    console.log(`📋  GET  /api/resume/:userId         → User's Resumes`);
    console.log(`🔎  GET  /api/resume/detail/:id      → Resume Detail\n`);
  });
});
