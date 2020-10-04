const mongoose = require('mongoose');
const { json } = require('body-parser');
const { object } = require('twilio/lib/base/serialize');
const Schema = mongoose.Schema;
let LogSchema = new Schema({
    reqId:{ type: String,unique:true,required:true},
    url: { type: String,required:true},
    req: { type: String ,required:true},
    res: { type:String},
    createdAt :  { type: Date, required: true, default: Date.now},
    updatedAt :{ type: String, required: true, default: Date.now },
    status: { type: String },
    fromIp : {type : String,required:true},
    body:{type: String},
    query:{type: String},
    method : {type : String,required:true}
});

LogSchema.index({ reqId: 1 });

// Export the model
module.exports = mongoose.model('Log', LogSchema);