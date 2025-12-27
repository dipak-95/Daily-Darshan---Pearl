const Temple = require('../models/Temple');
const Darshan = require('../models/Darshan');

// @desc    Get all temples
// @route   GET /api/temples
// @access  Public
const getTemples = async (req, res) => {
    const temples = await Temple.find({});
    res.json(temples);
};

// @desc    Get temple by ID
// @route   GET /api/temples/:id
// @access  Public
const getTempleById = async (req, res) => {
    const temple = await Temple.findById(req.params.id);
    if (temple) {
        res.json(temple);
    } else {
        res.status(404).json({ message: 'Temple not found' });
    }
};

// @desc    Get Darshan for a temple (Today or Yesterday)
// @route   GET /api/darshan/:templeId
// @access  Public
const getDarshan = async (req, res) => {
    const { templeId } = req.params;
    const { type } = req.query; // 'today' or 'yesterday'

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let queryDate;
    if (type === 'today') {
        queryDate = today;
    } else if (type === 'yesterday') {
        queryDate = yesterday;
    } else {
        // Default to returning both or error? 
        // Prompt says "Latest 2 din". 
        // Let's return both if no type specified, or handle specific request.
        // User UI has tabs "Today" and "Yesterday". API can probably support fetching specific.
        // Let's support specific date query.
    }

    if (queryDate) {
        const darshan = await Darshan.findOne({ temple: templeId, date: queryDate });
        // Return empty object/images if not found, not 404, so UI handles it gracefully
        if (darshan) {
            res.json(darshan);
        } else {
            res.json({ images: [] });
        }
    } else {
        // Return both
        const darshans = await Darshan.find({
            temple: templeId,
            date: { $gte: yesterday }
        }).sort({ date: -1 });
        res.json(darshans);
    }
};

module.exports = {
    getTemples,
    getTempleById,
    getDarshan,
};
