const { getStockPrices } = require('../services/stockService');
const { executeTrade } = require('../utils/tradeUtils');

let portfolio = {};
let balance = process.env.INITIAL_BALANCE || 10000;
let trades = [];

const checkTradingConditions = (currentPrice, previousPrice, stockName) => {
    if ((currentPrice - previousPrice) / previousPrice <= -0.02) {
        console.log(`Buying ${stockName} at ${currentPrice}`);
        executeTrade('buy', stockName, currentPrice, portfolio, balance, trades);
    } else if ((currentPrice - previousPrice) / previousPrice >= 0.03) {
        console.log(`Selling ${stockName} at ${currentPrice}`);
        executeTrade('sell', stockName, currentPrice, portfolio, balance, trades);
    }
};

const startTradingBot = () => {
    setInterval(() => {
        let stockPrices = getStockPrices(); // Simulate fetching stock prices

        for (let stock in stockPrices) {
            let prices = stockPrices[stock];
            for (let i = 1; i < prices.length; i++) {
                let previousPrice = prices[i - 1];
                let currentPrice = prices[i];
                checkTradingConditions(currentPrice, previousPrice, stock);
            }
        }
    }, 5000); // Runs every 5 seconds
};

module.exports = {
    startTradingBot,
};
