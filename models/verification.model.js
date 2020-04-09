const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('../configs/validation');

let VerificationSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verificationCode: { type: String, required: [true, 'user number is required'] },
    verificationType: { type: String },
    userDevice: { type: String, required: [true, 'user number is required'] },
    mobileNumber: { type: String, required: [true, 'mobile number is required'] },
    isVerified: { type: Boolean, },

});

module.exports = mongoose.model('Verification', VerificationSchema);
