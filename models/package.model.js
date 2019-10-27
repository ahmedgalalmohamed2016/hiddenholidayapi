const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PackageSchema = new Schema({
    creationDate: { type: Date, required: true, default: creationDate() },
    enName: { type: String, required: true, unique: true },
    enDescription: { type: String, required: true },
    arName: { type: String, required: true, unique: true },
    arDescription: { type: String, required: true },
    maxDeals: { type: Number, required: false },
    maxBids: { type: Number, required: true },
    maxDealRequests: { type: Number, required: true },
    maxBidRequests: { type: Number, required: true },
    isActive: { type: Boolean, required: true },
});

function creationDate() {
    return new Date();
}


// Export the model
module.exports = mongoose.model('Package', PackageSchema);