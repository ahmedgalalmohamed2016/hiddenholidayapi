const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TransactionSchema = new Schema({
    creationDate: { type: Date, required: true },
    from_userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to_userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
    sourceType: { type: String, required: true }, // Deal , Bid , Init
    sourceId: { type: mongoose.Schema.Types.ObjectId },
    sourceData: { type: mongoose.Schema.Types.Mixed },
    comment: { type: String },
    paymentMethod: { type: String, required: true }, // virtual cash credit
    isActive: { type: Boolean, required: true, default: true },
    code: { type: String, required: true },
});


// Export the model
module.exports = mongoose.model('Transaction', TransactionSchema);