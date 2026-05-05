require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const users = await User.find().sort({ createdAt: -1 }).limit(5);
        console.log('Last 5 users:');
        users.forEach(u => {
            console.log(`- ${u.email} (Verified: ${u.isVerified}, Created: ${u.createdAt})`);
        });
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

check();
