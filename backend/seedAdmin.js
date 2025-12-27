const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Admin.deleteMany();

        const adminUser = await Admin.create({
            username: 'admin',
            password: 'password123',
        });

        console.log('Admin User Created!');
        console.log('Username: admin');
        console.log('Password: password123');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
