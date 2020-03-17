const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Request = new Schema({
    creationDate: { type: Date },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    verificationCode: { type: String },
    title: { type: String },
    description: { type: String },
    type: { type: String }, // bid , deal 
    grossAmount: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    merchantAmount: { type: Number, required: true },
    sharePercentage: { type: String },
    comment: { type: String },
    status: { type: String }, //pending approved canceled 
    isSettled: { type: Boolean, default: false },
    isRefunded: { type: Boolean, default: false },
    transactionSource: { type: String }, // if refund must insert source transaction id
    bankAccount: { type: String },
});


// Export the model
module.exports = mongoose.model('Request', Request);