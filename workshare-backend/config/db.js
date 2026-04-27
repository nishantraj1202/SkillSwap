/**
 * ─────────────────────────────────────────────
 *  WorkShare Backend — MongoDB Connection
 * ─────────────────────────────────────────────
 *  Establishes and exports a reusable MongoDB
 *  connection via Mongoose.
 */

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit with failure so the dev notices immediately
  }
};

module.exports = connectDB;
