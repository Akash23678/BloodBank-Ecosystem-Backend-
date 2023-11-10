const mongoose = require("mongoose");

const donationSchema = mongoose.Schema({
    donor_id:{
        type:String,
        required:true,
        unique:false
    },
   donated_date:{
        type:String,
        required:true,
        unique:false
    },
    qty:{
        type:Number
    },
    blood_type:{
        type:String,
        required:true
    },
})
const donationModel = mongoose.model("donationModel", donationSchema);

module.exports = donationModel;

