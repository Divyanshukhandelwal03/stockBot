const User = require('../models/userModel');
const stockPrices = { "AAPL": 150, "TSLA": 700, "GOOGL": 2800 }; // Example stock prices

exports.buyStock = async (req, res) => {
    const { stock, quantity } = req.body;

    try {
        const user = await User.findById(req.user.id);
        const price = stockPrices[stock] * quantity;

        if (user.balance >= price) {
            user.balance -= price;
            user.portfolio.set(stock, (user.portfolio.get(stock) || 0) + quantity);
            await user.save();

            res.json({ message: `Bought ${quantity} shares of ${stock}` });
        } else {
            res.status(400).json({ message: 'Insufficient balance' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.sellStock = async (req, res) => {
    const { stock, quantity } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (user.portfolio.get(stock) && user.portfolio.get(stock) >= quantity) {
            const saleValue = stockPrices[stock] * quantity;
            user.balance += saleValue;
            user.portfolio.set(stock, user.portfolio.get(stock) - quantity);

            if (user.portfolio.get(stock) === 0) {
                user.portfolio.delete(stock);
            }

            await user.save();
            res.json({ message: `Sold ${quantity} shares of ${stock}` });
        } else {
            res.status(400).json({ message: 'Insufficient stock quantity' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
