const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CountrySchema = new Schema({
    enName: { type: String, unique: true },
    arName: { type: String },
    code: { type: String, unique: true },
    phone :  { type: String  },
    currency :{ type: String },
    isActive: { type: Boolean , default : true },
    exRate : {type : Number},
    encExRate : {type : String}
});



// Export the model
module.exports = mongoose.model('Country', CountrySchema);