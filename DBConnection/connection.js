const mongoose = require("mongoose");
function mongoDBConnection(URL){
    return mongoose.connect(URL)
    .then(() => {
        console.log("Successfully Connected to MongoDB");})
    .catch((err)=>{
        console.log("error in connection of BloodBankDB:", err);
    })   
}
module.exports = mongoDBConnection;