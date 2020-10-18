const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TransactionSchema = new Schema({
    creationDate: { type: Date, required: true, default: Date.now },
    validTo: { type: Date, required: true},
    refranceNum: { type: String, required: true },
    paymentMethod: { type: String, required: true }, // virtual cash credit
    transactionId: {  type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: false }, // virtual cash credit
    status: { type: String, required: true, default: true },
    
});

//sourceData [{senderName , recieverName , dealTitle, dealDescription  }]
// Export the model
module.exports = mongoose.model('TransactionRefrance', TransactionSchema);