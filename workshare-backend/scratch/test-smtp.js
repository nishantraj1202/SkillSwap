require('dotenv').config();
const nodemailer = require('nodemailer');

const t = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000,
  auth: {
    user: process.env.EMAIL_USER.trim(),
    pass: process.env.EMAIL_PASS.replace(/\s+/g, ''),
  },
});

console.log('Sending test email via SMTP...');
const start = Date.now();

t.sendMail({
  from: `"WorkShare" <${process.env.EMAIL_USER.trim()}>`,
  to: 'testuser9999@gmail.com',
  subject: 'WorkShare OTP Test',
  html: '<h1>Test OTP: 123456</h1>',
})
  .then((info) => {
    console.log(`Sent in ${Date.now() - start}ms`);
    console.log('Response:', info.response);
    console.log('Message ID:', info.messageId);
  })
  .catch((e) => {
    console.error(`Failed in ${Date.now() - start}ms`);
    console.error('Error:', e.message);
  });
