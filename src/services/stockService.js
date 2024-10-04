let stockPrices = {
    "AAPL": [150, 152, 148, 155, 153], // Simulated fluctuating prices
    "GOOG": [2800, 2820, 2750, 2850, 2900],
    "MSFT": [300, 310, 305, 295, 315],
    "TSLA": [700, 710, 680, 690, 720]
};

const getStockPrices = () => {
    // Simulate real-time stock price changes by shifting prices
    for (let stock in stockPrices) {
        stockPrices[stock].push(stockPrices[stock].shift());
    }
    return {
        AAPL: stockPrices['AAPL'][0],
        GOOG: stockPrices['GOOG'][0],
        MSFT: stockPrices['MSFT'][0],
        TSLA: stockPrices['TSLA'][0]
    };
};

module.exports = {
    getStockPrices,
};
