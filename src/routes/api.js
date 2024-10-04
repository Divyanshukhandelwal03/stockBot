const express = require('express');
const router = express.Router();

let users = {};
let stocks = {
    'AAPL': { price: 150 },
    'GOOGL': { price: 2800 },
    'AMZN': { price: 3400 },
    'MSFT': { price: 300 },
    'TSLA': { price: 700 }
};

// Mock data for user portfolios
let userPortfolios = {};

// Signup endpoint
router.post('/signup', (req, res) => {
    const { email, password } = req.body;
    if (users[email]) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }
    users[email] = { password };
    userPortfolios[email] = { balance: 10000, portfolio: {} };
    res.json({ success: true });
});

// Login endpoint
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!users[email] || users[email].password !== password) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    req.session.user = email;
    res.json({ success: true, balance: userPortfolios[email].balance, portfolio: userPortfolios[email].portfolio });
});

// Logout endpoint
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Get stocks endpoint
router.get('/stocks', (req, res) => {
    res.json(stocks);
});

// Buy stock endpoint
router.post('/buy', (req, res) => {
    const { stock, quantity } = req.body;
    const userEmail = req.session.user;
    
    if (!userEmail) {
        return res.status(401).json({ success: false, message: 'User not logged in' });
    }

    const userPortfolio = userPortfolios[userEmail];
    const stockPrice = stocks[stock].price;
    const totalCost = stockPrice * quantity;

    if (userPortfolio.balance < totalCost) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    userPortfolio.balance -= totalCost;
    userPortfolio.portfolio[stock] = userPortfolio.portfolio[stock] || { quantity: 0, buyPrice: stockPrice };
    userPortfolio.portfolio[stock].quantity += quantity;
    res.json({ success: true, balance: userPortfolio.balance, portfolio: userPortfolio.portfolio });
});

// Sell stock endpoint
router.post('/sell', (req, res) => {
    const { stock, quantity } = req.body;
    const userEmail = req.session.user;

    if (!userEmail) {
        return res.status(401).json({ success: false, message: 'User not logged in' });
    }

    const userPortfolio = userPortfolios[userEmail];
    
    if (!userPortfolio.portfolio[stock] || userPortfolio.portfolio[stock].quantity < quantity) {
        return res.status(400).json({ success: false, message: 'Not enough stock to sell' });
    }

    const stockPrice = stocks[stock].price;
    userPortfolio.balance += stockPrice * quantity;
    userPortfolio.portfolio[stock].quantity -= quantity;

    if (userPortfolio.portfolio[stock].quantity === 0) {
        delete userPortfolio.portfolio[stock];
    }

    res.json({ success: true, balance: userPortfolio.balance, portfolio: userPortfolio.portfolio });
});

// Get user information
router.get('/user', (req, res) => {
    const userEmail = req.session.user;
    if (!userEmail) {
        return res.status(401).json({ success: false, message: 'User not logged in' });
    }

    res.json({ email: userEmail, ...userPortfolios[userEmail] });
});

module.exports = router;
