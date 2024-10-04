const executeTrade = (type, stock, price, portfolio, balance, trades) => {
    if (type === "buy") {
        // Buy 1 share of the stock
        portfolio[stock] = { price, quantity: 1 };
        balance -= price;
        trades.push({ type: "buy", stock, price, timestamp: new Date() });
    } else if (type === "sell" && portfolio[stock]) {
        // Sell the stock
        let boughtPrice = portfolio[stock].price;
        let profit = price - boughtPrice;
        balance += price;
        trades.push({ type: "sell", stock, price, profit, timestamp: new Date() });
        delete portfolio[stock]; // Remove stock after selling
    }
};

const getReport = () => {
    let totalProfitLoss = trades.reduce((acc, trade) => {
        if (trade.type === 'sell') {
            acc += trade.profit;
        }
        return acc;
    }, 0);

    return {
        balance,
        totalProfitLoss,
        trades
    };
};

module.exports = {
    executeTrade,
    getReport,
};
