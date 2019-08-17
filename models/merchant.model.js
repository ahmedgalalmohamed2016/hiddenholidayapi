const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MerchantSchema = new Schema({
    favorite: {type:String ,required : false  },
    categories: {type: String  ,required : false},
    cat_name: {type: String ,required : false},
    clean_name: {type: String ,required : false},
    name: {type: String ,required : false},
    contact_person: {type: String ,required : false},
    emails: {type: String ,required : false},
    cover_photo: {type: String ,required : false},
    cover_photo2: {type: String ,required : false},
    cover_photo3: {type: String ,required : false},
    cover_photo4: {type: String ,required : false},
    logo: {type: String ,required : false},
    main_phone_number: {type: String ,required : false},
    homepage_desc: {type: String ,required : false},
    bio: {type: String ,required : false},
    price_rate: {type: String ,required : false},
    location_long: {type: String ,required : false},
    location_lat: {type: String ,required : false},
    facebook: {type: String ,required : false},
    instagram: {type: String ,required : false},
    website: {type: String ,required : false},
    video_thumb: {type: String ,required : false},
    operational_hours_description: {type: String ,required : false},
    preference : {type:String ,required : false}

});


// Export the model
module.exports = mongoose.model('Merchant', MerchantSchema);
