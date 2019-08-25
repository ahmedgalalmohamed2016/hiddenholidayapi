const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DealSchema = new Schema({
    creationDate: { type: Date },
    endDate: { type: Date },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verificationCode: { type: String },
    comment: { type: String },
    status: { type: String }
});


// Export the model
module.exports = mongoose.model('Deal', DealSchema);