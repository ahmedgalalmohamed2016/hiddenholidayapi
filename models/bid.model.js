const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BidSchema = new Schema({

    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true },
    title: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    sharePercentage: { type: Number, required: true },
    isActive: { type: Boolean, required: true, default: false }, //pending approved canceled
    isArchived: { type: Boolean, required: true, default: false },
    creationDate: { type: Date },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});


// Export the model
module.exports = mongoose.model('Bid', BidSchema);