const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const multer = require('multer');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
// Test Route to check Server & DB Status
// Test Route to check Server & DB Status
app.get('/', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.send(`<h1>Daily Darshan Backend is Running</h1><p>Database Status: <strong>${dbStatus}</strong></p>`);
});

const Admin = require('./models/Admin');
app.get('/create-magic-user', async (req, res) => {
    try {
        await Admin.deleteMany({});
        await Admin.create({ username: 'admin', password: 'password123' });
        res.send('<h1>Magic User Created: admin / password123</h1>');
    } catch (e) {
        res.send('Error: ' + e.message);
    }
});

app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

const path = require('path');
// Log requests to uploads
app.use('/uploads', (req, res, next) => {
    console.log("Serving image:", req.path);
    next();
}, express.static(path.join(__dirname, 'uploads')));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload Error: ${err.message}` });
    }
    res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Auto-delete cron job (Every hour)
const cron = require('node-cron');
const Darshan = require('./models/Darshan');
const fs = require('fs');

cron.schedule('0 * * * *', async () => {
    console.log('Running auto-delete cron job...');
    try {
        const cutoff = new Date();
        cutoff.setHours(cutoff.getHours() - 48); // 48 hours ago

        // Find darshans older than cutoff
        const oldDarshans = await Darshan.find({ date: { $lt: cutoff } });

        for (const darshan of oldDarshans) {
            // Delete files
            for (const imageUrl of darshan.images) {
                const filePath = path.join(__dirname, imageUrl);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`Auto-deleted: ${filePath}`);
                }
            }
            // Delete DB record
            await Darshan.findByIdAndDelete(darshan._id);
            console.log(`Deleted Darshan record: ${darshan._id}`);
        }
    } catch (error) {
        console.error('Cron job error:', error);
    }
});
