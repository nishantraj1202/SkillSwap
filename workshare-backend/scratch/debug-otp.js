require('dotenv').config();
const { sendOTP } = require('../helpers/emailHelper');

async function test() {
    const testEmails = [
        'nishantraj2077@gmail.com', // Should (maybe) go via Resend if it's the owner, or SMTP
        'nishantrj.cs.23@nitj.ac.in', // Should go via Resend if it's the actual owner
        'test-workshare-123@mailinator.com' // Should go via SMTP
    ];

    for (const email of testEmails) {
        console.log(`\n--- Testing for: ${email} ---`);
        try {
            const result = await sendOTP(email, '999999');
            console.log('Result:', result);
        } catch (err) {
            console.error('Error in sendOTP:', err);
        }
    }
}

test();
