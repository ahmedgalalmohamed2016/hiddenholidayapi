const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TransactionSchema = new Schema({
    creationDate: { type: Date, required: true },
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: false },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: false },
    cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
    grossAmount: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    merchantAmount: { type: Number, required: true },
    currency: { type: String, required: true },
    sharePercentage: { type: String, required: true }, //number or 'multi'
    status: { type: String, required: true },
    sourceType: { type: String, required: true }, // Deal , Bid , Init , Purchase
    sourceData: { type: mongoose.Schema.Types.Mixed },
    comment: { type: String },
    exRate: { type: Number },
    paymentMethod: { type: String, required: true }, // virtual cash credit
    isActive: { type: Boolean, required: true, default: true },
    code: { type: String, required: true },
    isSettled: { type: Boolean, default: false },
    isRefunded: { type: Boolean, default: false },
    transactionSource: { type: String }, // if refund must insert source transaction id
    bankAccount: { type: String },
});

//sourceData [{senderName , recieverName , dealTitle, dealDescription  }]
// Export the model
module.exports = mongoose.model('Transaction', TransactionSchema);