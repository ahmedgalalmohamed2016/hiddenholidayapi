const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CardSchema = new Schema({
    creationDate: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cardNumber: { type: String, required: true },
    expireMonth: { type: String, required: true },
    expireYear: { type: String, required: true },
    holderName: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
});


// Export the model
module.exports = mongoose.model('Card', CardSchema);