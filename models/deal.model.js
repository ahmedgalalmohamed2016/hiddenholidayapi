const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DealSchema = new Schema({

    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true },
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
    title: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    titleAr: { type: String },
    descriptionAr: { type: String },
    image: { type: String },
    newPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    maximumDays: { type: Number, required: true },
    sharePercentage: { type: Number, required: true },
    type: { type: String, required: true }, // deal , bid
    timeUsed: { type: String, required: true }, // 7
    isActive: { type: Boolean, required: true, default: false }, //pending approved canceled
    isArchived: { type: Boolean, required: true, default: false },
    creationDate: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },

});


// Export the model
module.exports = mongoose.model('Deal', DealSchema);