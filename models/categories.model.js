const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategoriesSchema = new Schema({
    creationDate: { type: Date },
    enName: { type: String },
    arName: { type: String },
    icon: { type: String },
    smallImage: { type: String },
    bannerImage: { type: String },
    initBalance: { type: Number },
    isActive: { type: Boolean },
});


// Export the model
module.exports = mongoose.model('Categories', CategoriesSchema);