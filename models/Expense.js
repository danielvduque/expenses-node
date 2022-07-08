const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    total: Number,
    currency: String,
    type: String,
    where: String,
    datetime: { type: Date, default: Date.now },
    description: String
});
const Expense = mongoose.model('Expense', schema);
module.exports = Expense;