const express = require('express');
const router = express.Router();
const { getStockPrices } = require('../services/stockService');

// API to fetch stock prices
router.get('/stocks', (req, res) => {
    const stockPrices = getStockPrices();
    res.json(stockPrices);
});

module.exports = router;
