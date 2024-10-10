const express = require('express');
const router = express.Router();
const { buyStock, sellStock } = require('../controllers/stockController');
const auth = require('../middleware/authMiddleware');

// Buy stock route
router.post('/buy', auth, buyStock);

// Sell stock route
router.post('/sell', auth, sellStock);

module.exports = router;
