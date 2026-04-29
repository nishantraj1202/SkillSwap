const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../.env" });

async function testEmail() {
  const { EMAIL_USER, EMAIL_PASS } = process.env;
  
  console.log("Testing with:");
  console.log("Email:", EMAIL_USER);
  console.log("Password Length:", EMAIL_PASS?.length);
  
  // Strip spaces if present
  const cleanPass = EMAIL_PASS?.replace(/\s+/g, "");
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: cleanPass,
    },
  });

  try {
    console.log("Verifying transporter...");
    await transporter.verify();
    console.log("✅ Success! Transporter is ready to send emails.");
  } catch (error) {
    console.error("❌ Failed to verify transporter:");
    console.error(error.message);
    if (error.response) console.error("Response:", error.response);
  }
}

testEmail();
