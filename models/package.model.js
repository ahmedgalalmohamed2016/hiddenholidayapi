const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PackageSchema = new Schema({
    creationDate: { type: Date, required: true },
    enName: { type: String, required: true, unique: true },
    enDescription: { type: String, required: true },
    arName: { type: String, required: true, unique: true },
    arDescription: { type: String, required: true },
    initBalance: { type: Number, required: true },
    maxDeals: { type: Number, required: true },
    maxBids: { type: Number, required: true },
    maxDealRequests: { type: Number, required: true },
    maxBidRequests: { type: Number, required: true },
    isActive: { type: Boolean, required: true },
});


// Export the model
module.exports = mongoose.model('Package', PackageSchema);