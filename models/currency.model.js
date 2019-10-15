const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CurrencySchema = new Schema({
    base: { type: String },
    rates: { type: mongoose.Schema.Types.Mixed },
});


// Export the model
module.exports = mongoose.model('Currency', CurrencySchema);