const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DealSchema = new Schema({
    startDate: Date,
    endDate: Date,
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Verification' },
    comment: { type: String },
    status: { type: String }
});


// Export the model
module.exports = mongoose.model('Deal', DealSchema);