const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('../configs/validation');

let UserSchema = new Schema({
    userNumber: { type: String, unique: true, required: [true, 'user number is required'] },
    role: { type: String, required: true },
    firstName: {
        type: String,
        required: [true, 'First name is required.'],
        // validate: {
        //     validator: function (v) {
        //         return _.validation.name.test(v);
        //     },
        //     message: props => `${props.value} is not a valid first name!`
        // },
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required.'],
        // validate: {
        //     validator: function (v) {
        //         return _.validation.name.test(v);
        //     },
        //     message: props => `${props.value} is not a valid last name!`
        // },
    },
    address: { type: String },
    profileImage: { type: String },
    password: { type: String },
    userToken: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    mobileNumber: { type: String, unique: true },
    gender: { type: String },
    userDevice: { type: String },
    merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
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

});
module.exports = mongoose.model('User', UserSchema);