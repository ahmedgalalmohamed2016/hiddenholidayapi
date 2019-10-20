const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PackageSchema = new Schema({
    creationDate: { type: Date },
    enTitle: { type: String },
    enDescription: { type: String },
    initBalance: { type: Number },
    arTitle: { type: String },
    arDescription: { type: String },
    initBalance: { type: Number },
    maxDeals: { type: Number },
    maxBids: { type: String },
    maxDealRequests: { type: Number },
    maxBidRequests: { type: String },
    isActive : { type: Boolean },
});


// Export the model
module.exports = mongoose.model('Package', PackageSchema);