const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');
const {
    authAdmin,
    registerAdmin,
    createTemple,
    updateTemple,
    deleteTemple,
    addDarshan,
    deleteDarshanImage
} = require('../controllers/adminController');

router.post('/login', authAdmin);
router.post('/register', registerAdmin); // Keep for initial setup
router.route('/temples')
    .post(protect, createTemple);
router.route('/temples/:id')
    .put(protect, updateTemple)
    .delete(protect, deleteTemple);

// Darshan upload with images
router.post('/darshan', protect, upload.array('images', 10), addDarshan);
router.delete('/darshan/image', protect, deleteDarshanImage);

module.exports = router;
