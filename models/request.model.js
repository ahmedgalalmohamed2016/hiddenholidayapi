const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Request = new Schema({
    creationDate: { type: Date },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
    dealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal', required: true },
    verificationCode: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    arTitle: { type: String },
    arDescription: { type: String },
    type: { type: String }, // bid , deal 
    grossAmount: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    merchantAmount: { type: Number, required: true },
    sharePercentage: { type: String },
    count: { type: Number, required: true },
    comment: { type: String },

    country: { type: String, required: true },
    maximumDays: { type: Number, required: true },
    timeUsed: { type: String, required: true },
    howManyUsed: { type: Number, required: true, default: 0 },
    status: { type: String }, //pending approved canceled 
    isSettled: { type: Boolean, default: false },
    isRefunded: { type: Boolean, default: false },
    settledRequest: { type: Boolean, default: false },
    isUsed: { type: Boolean, default: false },
    transactionSource: { type: String }, // if refund must insert source transaction id
    bankAccount: { type: String },

    deliveryRequested: { type: Boolean, default: false },
    deliveryStatus: { type: mongoose.Schema.Types.Mixed }, //request - accept/decline - prepare - delivery -done
    deliveryAddress: { type: String },
    deliveryMobileNumber: { type: String },
    deliveryName: { type: String },
    deliveryTime: { type: String },
});


// Export the model
module.exports = mongoose.model('Request', Request);