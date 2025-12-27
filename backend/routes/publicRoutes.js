const express = require('express');
const router = express.Router();
const {
    getTemples,
    getTempleById,
    getDarshan,
} = require('../controllers/publicController');

router.get('/temples', getTemples);
router.get('/temples/:id', getTempleById);
router.get('/darshan/:templeId', getDarshan);

module.exports = router;
