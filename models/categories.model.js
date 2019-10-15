const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategoriesSchema = new Schema({
    creationDate: { type: Date },
    enName: { type: String },
    arName: { type: String },
    initBalance: { type: Number },
    isActive: { type: String }
});


// Export the model
module.exports = mongoose.model('Categories', CategoriesSchema);