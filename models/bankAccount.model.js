const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BankAccount = new Schema({
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' }, //
    accountNumber: { type: String, required: true }, //
    branchName: { type: String, required: true }, //
    nameHolder: { type: String, required: true },
    branchAddress: { type: String, required: true },
    bankName: { type: String, required: true }, //
    country: { type: String, required: true },
    currency: { type: String, required: true }, //
    accountType: { type: String, required: true }, //
    comment: { type: String }, //
    status: { type: String }, //pending approved canceled 
    isDeleted: { type: Boolean, default: false },
    isDefault: { type: Boolean, default: false },
    creationDate: { type: Date, required: true }
});


// Export the model
module.exports = mongoose.model('BankAccount', BankAccount);