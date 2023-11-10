const mongoose = require("mongoose");

const bloodBagSchema = mongoose.Schema({
   donated_date:{
        type:String,
        required:true,
        unique:false
    },
    qty:{
        type:Number,
        required:true,
        
    },
    blood_type:{
        type:String,
        required:true
    },
})
const bloodBagModel = mongoose.model("bloodBagModel", bloodBagSchema);

module.exports = bloodBagModel