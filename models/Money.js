var mongoose = require('mongoose');

var MoneySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    updated: { type: Date, default: Date.now }
});

var Money = mongoose.model('Money', MoneySchema);

module.exports = Money;