const mongoose = require("mongoose");

const bloodUsageSchema = mongoose.Schema({
    
    qty:{
        type:Number,
        required:true,
        
    },
    blood_type:{
        type:String,
        required:true
    },
    used_date:{
        type:String,
        required:true,
    },
    bloodBag_id:{
        type:String,
        required:true,
    }
})
const bloodUsageModel = mongoose.model("bloodUsageModel", bloodUsageSchema);

module.exports = bloodUsageModel