const donorModel = require("../Models/donors");
const express = require("express");


const handleCreateDonor = async (req, res)=>{
    const body = req.body;
    console.log(body);
    if(!body || !body.name || !body.phoneNumber || !body.address || !body.dateOfBirth ||
        !body.gender || !body.bloodType){
            return res.status(400).json({ "msg":"All inputs required" });
    }

//PhonenUmber validation
    const regex = /^\d{10}$/;
    if(regex.test(body.phoneNumber)){
        console.log("Valid Phone Number");
    }else{
        return res.status(400).json({"msg":"Not A Valid Number"});
    }
//BloodGroup Validation
    const bloodGroupList = ["A+","A-","B+", "B-", "AB+", "AB-", "O+", "O-"];
    if(!bloodGroupList.includes(body.bloodType)){
        return res.status(400).json({msg:"Pls Enter Valid Blood Group"});
    }else{
        console.log("valid blood gr");
    }
//PhoneNumber Existance
    const phone = await donorModel.findOne({phone_number: body.phoneNumber});
    if(phone){
        return res.status(409).json({"msg":"PhoneNumber already register"});
    }else{
        console.log("Unique Ph Number");
    }


//Create Document
    const donor = await donorModel.create({
        name: body.name,
        phone_number:body.phoneNumber,
        address:body.address,
        date_of_birth:body.dateOfBirth,
        gender:body.gender,
        blood_type: body.bloodType,
        medical_history:body.medicalHistory

    })
    return res.status(201).json({msg:"Donor Created Successfully", donorId:donor._id, res: donor});

} 


//Handle Get All donors
const handleGetAllDonors = async (req, res)=>{
    const result = await donorModel.find({});
    let total_Donors = result.length;
    if(total_Donors==0){
        return res.json({
            msg:"Donors Not Found",
        })
    }
    return res.json({"number of Donors":total_Donors, result});
}


//Handle get given donor by ID
const handleGetDonorById = async (req, res)=>{
    const id = req.params.donorId;
    console.log(id);
    const donor = await donorModel.findOne({_id:id});
    if(!donor){
        return res.status(404). json({
            msg: `Donor Not Found With Your ID ${id}`
        })
    }
    return res.json(donor);
}




module.exports = {
    handleCreateDonor,
    handleGetAllDonors,
    handleGetDonorById
}






//age Calucation

// function calculateAge (birthDate) {
//     birthDate = new Date(birthDate);
//     currDate = new Date();

//     var years = (currDate.getFullYear() - birthDate.getFullYear());

//     if (currDate.getMonth() < birthDate.getMonth() || 
//         currDate.getMonth() == birthDate.getMonth() && currDate.getDate() < birthDate.getDate()) {
//         years--;
//     }

//     return years;
// }
// const age = calculateAge(body.dateOfBirth);
// console.log(age);