const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CountrySchema = new Schema({
    enName: { type: String, unique: true },
    arName: { type: String, unique: true },
    code: { type: String, unique: true },
    isActive: { type: Boolean },
    initBalance: { type: mongoose.Schema.Types.Mixed } // {categoryName : "", balance:""}
});


// Export the model
module.exports = mongoose.model('Country', CountrySchema);