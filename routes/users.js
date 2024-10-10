const express = require('express');
const router = express.Router();
const { getUserDashboard } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Get user dashboard data

router.get('/dashboard', auth, getUserDashboard);
module.exports = router;
