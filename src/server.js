const express = require('express');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Hardcoded users for login/signup
const users = {
    'john@example.com': { password: '12345', balance: 10000, portfolio: {} },
    'jane@example.com': { password: '54321', balance: 15000, portfolio: {} }
};

// Stock prices
const stocks = {
    'AAPL': { price: 150 },
    'GOOG': { price: 2800 },
    'TSLA': { price: 700 }
};

// Function to update stock prices randomly
function updateStockPrices() {
    for (const stock in stocks) {
        const fluctuation = (Math.random() * 10 - 5); // Random change between -5 to +5
        stocks[stock].price = parseFloat((stocks[stock].price + fluctuation).toFixed(2));
    }
}

// Update stock prices every 5 seconds
setInterval(updateStockPrices, 5000);

// Signup route
app.post('/api/signup', (req, res) => {
    const { email, password } = req.body;

    if (users[email]) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Adding new user
    users[email] = { password, balance: 10000, portfolio: {} };
    res.json({ success: true });
});

// Login route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Verify user credentials
    if (users[email] && users[email].password === password) {
        req.session.user = {
            email,
            balance: users[email].balance,
            portfolio: users[email].portfolio
        };
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
});

// Get user session data (e.g., balance, portfolio)
app.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ message: 'User not logged in' });
    }
});

// Logout route
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Route to get stock prices
app.get('/api/stocks', (req, res) => {
    res.json(stocks);
});

// Buy stock
app.post('/api/buy', (req, res) => {
    const { stock, quantity } = req.body;
    const user = req.session.user;

    if (!user) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    const stockPrice = stocks[stock]?.price;

    if (!stockPrice) {
        return res.status(400).json({ message: 'Invalid stock symbol' });
    }

    const totalCost = stockPrice * quantity;

    if (user.balance >= totalCost) {
        user.balance -= totalCost;
        if (user.portfolio[stock]) {
            user.portfolio[stock].quantity += quantity;
        } else {
            user.portfolio[stock] = { quantity, buyPrice: stockPrice };
        }
        res.json({ success: true, balance: user.balance, portfolio: user.portfolio });
    } else {
        res.status(400).json({ message: 'Insufficient funds' });
    }
});

// Sell stock
app.post('/api/sell', (req, res) => {
    const { stock, quantity } = req.body;
    const user = req.session.user;

    if (!user) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    const stockPrice = stocks[stock]?.price;

    if (!stockPrice) {
        return res.status(400).json({ message: 'Invalid stock symbol' });
    }

    const userStock = user.portfolio[stock];

    if (!userStock || userStock.quantity < quantity) {
        return res.status(400).json({ message: 'Not enough stock to sell' });
    }

    const totalRevenue = stockPrice * quantity;
    user.balance += totalRevenue;
    userStock.quantity -= quantity;

    if (userStock.quantity === 0) {
        delete user.portfolio[stock];
    }

    res.json({ success: true, balance: user.balance, portfolio: user.portfolio });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
