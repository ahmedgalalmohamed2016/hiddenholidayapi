const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MerchantSchema = new Schema({
    is_active: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories' },
    favorite: { type: String },
    categories: { type: String },
    country: { type: String },
    city: { type: String },
    cat_name: { type: String },
    clean_name: { type: String },
    name: { type: String },
    isActivePromotion: { type: Boolean, default: false },
    isActiveMerchant: { type: Boolean, default: false },
    isActiveBids: { type: Boolean, default: true },

    contact_person: { type: String },
    emails: { type: String },
    cover_photo: { type: String },
    cover_photo2: { type: String },
    cover_photo3: { type: String },
    cover_photo4: { type: String },
    logo: { type: String },
    main_phone_number: { type: String },
    homepage_desc: { type: String },
    bio: { type: String },
    price_rate: { type: String },
    location_long: { type: String },
    location_lat: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    website: { type: String },
    video_thumb: { type: String },
    operational_hours_description: { type: String },
    preference: { type: String },
    address: { typ: String },
    promotion: { type: mongoose.Schema.Types.Mixed },
    merchantSource: { type: String, default: 'local' } // handle collected data with our data Application,local

});


// Export the model
module.exports = mongoose.model('Merchant', MerchantSchema);