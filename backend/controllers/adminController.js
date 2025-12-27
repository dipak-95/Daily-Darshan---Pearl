const Admin = require('../models/Admin');
const Temple = require('../models/Temple');
const Darshan = require('../models/Darshan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const authAdmin = async (req, res) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
        res.json({
            _id: admin._id,
            username: admin.username,
            token: generateToken(admin._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
};

// @desc    Register a new admin (First time setup or internal use)
// @route   POST /api/admin/register
// @access  Public (Should be protected or removed in prod)
const registerAdmin = async (req, res) => {
    const { username, password } = req.body;
    const adminExists = await Admin.findOne({ username });

    if (adminExists) {
        res.status(400).json({ message: 'Admin already exists' });
        return;
    }

    const admin = await Admin.create({
        username,
        password,
    });

    if (admin) {
        res.status(201).json({
            _id: admin._id,
            username: admin.username,
            token: generateToken(admin._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid admin data' });
    }
};

// @desc    Create a new temple
// @route   POST /api/admin/temples
// @access  Private
const createTemple = async (req, res) => {
    const { name, image, location, description } = req.body;

    const temple = new Temple({
        name,
        image,
        location,
        description,
    });

    const createdTemple = await temple.save();
    res.status(201).json(createdTemple);
};

// @desc    Update a temple
// @route   PUT /api/admin/temples/:id
// @access  Private
const updateTemple = async (req, res) => {
    const { name, image, location, description } = req.body;

    const temple = await Temple.findById(req.params.id);

    if (temple) {
        temple.name = name || temple.name;
        temple.image = image || temple.image;
        temple.location = location || temple.location;
        temple.description = description || temple.description;

        const updatedTemple = await temple.save();
        res.json(updatedTemple);
    } else {
        res.status(404).json({ message: 'Temple not found' });
    }
};

// @desc    Delete a temple
// @route   DELETE /api/admin/temples/:id
// @access  Private
const deleteTemple = async (req, res) => {
    const temple = await Temple.findById(req.params.id);

    if (temple) {
        await temple.deleteOne();
        res.json({ message: 'Temple removed' });
    } else {
        res.status(404).json({ message: 'Temple not found' });
    }
};

// @desc    Add Daily Darshan
// @route   POST /api/admin/darshan
// @access  Private
const addDarshan = async (req, res) => {
    console.log("addDarshan called");
    console.log("Files:", req.files ? req.files.length : "No files");
    console.log("Body:", req.body);
    const { templeId, date, images } = req.body;
    // Images should be an array of image URLs (uploaded via middleware before this controller if using separate upload route, 
    // or passed here if using a combined flow. User requested cloud storage.
    // If using middleware, req.files will contain the uploaded files. 
    // For simplicity, we'll assume the client uploads to Cloudinary first or we handle it here.
    // The previous prompt implies "Multiple photos upload". 
    // I'll assume the frontend sends an array of image URLs or we handle the upload in the route.

    // Simplest flow: Route uses multer-storage-cloudinary, puts files in req.files

    let imageUrls = [];
    if (req.files) {
        // Map local path to URL. Replace backslashes for Windows compatibility.
        // Assuming server runs on the same host as client requests for now (localhost:5000)
        // We store the relative path "/uploads/filename.jpg"
        imageUrls = req.files.map(file => {
            // Store relative path: "/uploads/filename.jpg"
            return `/uploads/${file.filename}`;
        });
    } else if (images) {
        imageUrls = images;
    }

    if (!imageUrls || imageUrls.length === 0) {
        return res.status(400).json({ message: 'No images uploaded' });
    }

    // Check if darshan for this date already exists, if so update or append?
    // "App ka content bina app update ke change kar sakta hai" means admin manages it.
    // Usually one entry per day per temple.

    // Normalize date to start of day
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const darshanExists = await Darshan.findOne({ temple: templeId, date: d });

    if (darshanExists) {
        // Update functionality could be here, or just reject.
        // Let's append images or replace. User might want to 'Manage'.
        // For 'Daily Darshan Upload', usually it's a new batch. 
        // We will just replace images for simplicity or append. Replaced is safer for "Upload" context.
        darshanExists.images = imageUrls;
        const updatedDarshan = await darshanExists.save();
        res.json(updatedDarshan);
    } else {
        const darshan = new Darshan({
            temple: templeId,
            date: d,
            images: imageUrls,
        });

        const createdDarshan = await darshan.save();
        res.status(201).json(createdDarshan);
    }
};

// @desc    Delete a specific darshan image
// @route   DELETE /api/admin/darshan/image
// @access  Private
const deleteDarshanImage = async (req, res) => {
    const { templeId, date, imageUrl } = req.body;

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const darshan = await Darshan.findOne({ temple: templeId, date: d });

    if (darshan) {
        // Remove from DB
        darshan.images = darshan.images.filter(img => img !== imageUrl);
        await darshan.save();

        // Remove from Disk
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '..', imageUrl); // imageUrl is /uploads/file.png

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ message: 'Image deleted', images: darshan.images });
    } else {
        res.status(404).json({ message: 'Darshan not found' });
    }
};

module.exports = {
    authAdmin,
    registerAdmin,
    createTemple,
    updateTemple,
    deleteTemple,
    addDarshan,
    deleteDarshanImage
};
