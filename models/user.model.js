const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('../configs/validation');

let UserSchema = new Schema({
    userNumber: { type: String, unique: true, required: [true, 'user number is required'] },
    role: { type: String, required: true },
    firstName: { type: String, },
    lastName: { type: String, },
    address: { type: String },
    profileImage: { type: String },
    password: { type: String },
    userToken: { type: String },
    email: { type: String },
    mobileNumber: { type: String, unique: true },
    gender: { type: String },
    userDevice: { type: String },
    country: { type: String },
    merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
    merchantData: { type: mongoose.Schema.Types.Mixed },
    //verificarions
    isApproved: { type: Boolean, default: true },
    isVisible: { type: Boolean, default: true },
    isLockedOut: { type: Boolean, default: false },
    lastPasswordChangedDate: { type: String },
    failedPasswordAttepmtCount: { type: Number, default: 0 },
    lastLoginDate: { type: Date },
    verifiedUserName: { type: Boolean, default: true },
    verifiedMobileNumber: { type: Boolean, default: false },
    verifiedEmail: { type: Boolean, default: false },
    notificationEmail: { type: Boolean, default: true },
    notificationMobile: { type: Boolean, default: true },
    socketId: { type: String },

});
module.exports = mongoose.model('User', UserSchema);