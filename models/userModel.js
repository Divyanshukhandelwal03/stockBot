const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 1000
    },
    portfolio: {
        type: Map,
        of: Number,
        default: {}
    }
});

module.exports = mongoose.model('User', UserSchema);
