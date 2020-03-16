const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BankAccount = new Schema({
    creationDate: { type: Date },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
    accountNumber: { type: String, required: true },
    branch: { type: String, required: true },
    nameHolder: { type: String, required: true },
    swiftCode: { type: String, required: true },
    bankName: { type: String, required: true },
    currency: { type: String, required: true },
    accountType: { type: String, required: true },
    comment: { type: String },
    status: { type: String } //pending approved canceled 
});


// Export the model
module.exports = mongoose.model('BankAccount', BankAccount);