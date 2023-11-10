const mongoose = require("mongoose");

const donorSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone_number:{
        type:String,
        required:true,
        unique: true
    },
    address:{
        type:String,
    },
    date_of_birth:{
        type:Date,
        required:true
    },
    gender:{
        type:String
    },
    
    blood_type:{
        type:String,
        required:true
    },
    
    medical_history:{
        type:String,
        default:"No medical History"
    },

})
const donorModel = mongoose.model("donorModel", donorSchema);

module.exports =  donorModel

