const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AirportSchema = new Schema({
    continent: { type: String },
    coordinates: { type: mongoose.Schema.Types.Mixed },
    elevation_ft: { type: String },
    gps_code: { type: String },
    iata_code: { type: String },
    ident: { type: String },
    iso_country: { type: String },
    iso_region: { type: String },
    local_code: { type: String },
    municipality: { type: String },
    name: { type: String },
    type: { type: String },
});


// Export the model
module.exports = mongoose.model('Airport', AirportSchema);