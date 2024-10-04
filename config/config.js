require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    INITIAL_BALANCE: process.env.INITIAL_BALANCE || 10000,
};
