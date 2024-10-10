const User = require('../models/userModel');
const stockPrices = { "AAPL": 150, "TSLA": 700, "GOOGL": 2800 }; // Example stock prices

exports.getUserDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            balance: user.balance,
            portfolio: user.portfolio,
            stockPrices
        });
        // res.render('bot');
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
