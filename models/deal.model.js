const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DealSchema = new Schema({
    creationDate: { type: Date },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verificationCode: { type: String },
    title: { type: String },
    description: { type: String },
    type: { type: String },
    amount  :{type : String},
    price  :{type : String},
    usersType : {type : String},
    subscriptionFees : {type : String},
    sharePercentage : {type : String},
    comment: { type: String },
    status: { type: String } //pending approved canceled 
});


// Export the model
module.exports = mongoose.model('Deal', DealSchema);