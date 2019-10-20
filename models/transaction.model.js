const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TransactionSchema = new Schema({
    creationDate: { type: Date },
    from_userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to_userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number },
    currency: { type: String },
    status: { type: String },
    sourceType: { type: String }, // Deal , Bid , Init
    comment: { type: String },
    paymentMethod: { type: String },
    isActive: { type: Boolean },
    code: { type: String },
});


// Export the model
module.exports = mongoose.model('Transaction', TransactionSchema);