const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MerchantSchema = new Schema({
    favorite: { type: String },
    categories: { type: String },
    country: { type: String },
    city: { type: String },
    cat_name: { type: String },
    clean_name: { type: String },
    name: { type: String },
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
    promotion: { type: mongoose.Schema.Types.Mixed }
    // promotion
    // promotion_title: { type: String },
    // promotion_description: { type: String },
    // promotion_type: { type: String },
    // promotion_amount: { type: String },
    // promotion_start_date: { type: Date },
    // promotion_end_date: { type: Date },
    // promotion_for: { type: String },
    // promotion_subscription_fees: { type: Number },
    // promotion_share_percentage: { type: String },



});


// Export the model
module.exports = mongoose.model('Merchant', MerchantSchema);