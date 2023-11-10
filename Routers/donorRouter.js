const express = require("express");
const router = express.Router();
const {handleCreateDonor, handleGetAllDonors, handleGetDonorById} = require("../Controllers/donorController");

router.route("/")
.post(handleCreateDonor)
.get(handleGetAllDonors);

router.route("/:donorId")
.get(handleGetDonorById)

module.exports= router;