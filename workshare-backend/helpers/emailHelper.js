const nodemailer = require("nodemailer");
const { Resend } = require("resend");

// Resend client for hosted deployments.
let resendClient = null;

function getResendClient() {
  if (resendClient) return resendClient;

  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  if (!resendApiKey) return null;

  resendClient = new Resend(resendApiKey);
  return resendClient;
}

// SMTP fallback for local development.
let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "");
  if (!emailUser || !emailPass) return null;

  cachedTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  return cachedTransporter;
}

function getOtpHtml(otp) {
  return `
    <div style="font-family:Arial,sans-serif;padding:24px;background:#0b1020;color:#f8fafc">
      <div style="max-width:520px;margin:0 auto;background:linear-gradient(180deg,#151c34 0%,#0f172a 100%);border:1px solid #334155;border-radius:20px;padding:32px">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#a5b4fc">WorkShare</p>
        <h2 style="margin:0 0 12px;font-size:28px;color:#ffffff">Verify your account</h2>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#cbd5e1">
          Use the OTP below to finish creating your account. It expires in 10 minutes.
        </p>
        <div style="margin:0 0 24px;padding:18px 22px;border-radius:16px;background:linear-gradient(135deg,#7c3aed 0%,#ec4899 100%);text-align:center">
          <div style="font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.8)">One-time password</div>
          <div style="margin-top:8px;font-size:36px;font-weight:700;letter-spacing:0.35em;color:#ffffff">${otp}</div>
        </div>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#94a3b8">
          If you did not request this, you can ignore this email.
        </p>
      </div>
    </div>
  `;
}

async function sendViaResend(resend, fromAddress, email, html) {
  const { data, error } = await resend.emails.send({
    from: `WorkShare <${fromAddress}>`,
    to: email,
    subject: "Verify your WorkShare account",
    html,
  });

  if (error) {
    throw new Error(error.message || "Resend validation error");
  }

  console.log(`Resend API accepted email for ${email}. ID:`, data?.id);
  return { delivered: true, fallback: false };
}

async function sendViaSmtp(transporter, email, html) {
  console.log(`Attempting SMTP delivery to ${email}...`);
  await transporter.sendMail({
    from: `"WorkShare" <${process.env.EMAIL_USER?.trim()}>`,
    to: email,
    subject: "Verify your WorkShare account",
    html,
  });

  console.log(`OTP email sent to ${email} via SMTP`);
  return { delivered: true, fallback: false };
}

async function sendOTP(email, otp) {
  // Always log OTP in console to assist in development/testing
  console.log(`\n=========================================`);
  console.log(`🔑 DEVELOPMENT OTP: ${otp} for ${email}`);
  console.log(`=========================================\n`);

  const html = getOtpHtml(otp);
  const normalizedRecipient = email.trim().toLowerCase();
  const smtpOwner = process.env.EMAIL_USER?.trim().toLowerCase();
  const fromAddress = (process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev").trim();
  const resend = getResendClient();
  if (resend) {
    try {
      console.log(`📡 Attempting Resend delivery to ${email}...`);
      return await sendViaResend(resend, fromAddress, email, html);
    } catch (error) {
      console.error("❌ Resend delivery failed, falling back to SMTP:", error.message);
    }
  }

  const transporter = getTransporter();
  if (transporter) {
    try {
      console.log(`📡 Attempting SMTP delivery to ${email} (from ${process.env.EMAIL_USER})...`);
      return await sendViaSmtp(transporter, email, html);
    } catch (error) {
      console.error("❌ SMTP delivery failed:", error.message);
    }
  }

  console.warn(`OTP email transport unavailable. OTP for ${email}: ${otp}`);
  return {
    delivered: false,
    fallback: true,
    reason: "no_transport_available",
  };
}

module.exports = {
  sendOTP,
};
