const express = require("express");
const router = express.Router();
const {
    handleAddDonation, 
    handleGetAllDonations,
    handleGetHistoryOfDonor, } = require("../Controllers/donationController");

console.log("this is donation ROuter");

//Create Donation & BloodBag
router.route("/add")
.post(handleAddDonation);

// Get all Donations record
router.route("/all")
.get(handleGetAllDonations);

//Get History of donation of a Donor
router.route("/history/:donorId")
.get(handleGetHistoryOfDonor);

module.exports=router;

