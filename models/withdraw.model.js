const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Withdraw = new Schema({
    creationDate: { type: Date },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bankId: { type: mongoose.Schema.Types.ObjectId, ref: 'BankAccount', required: true },
    isSettled: { type: Boolean },
    status: { type: String }
});


// Export the model
module.exports = mongoose.model('Withdraw', Withdraw);