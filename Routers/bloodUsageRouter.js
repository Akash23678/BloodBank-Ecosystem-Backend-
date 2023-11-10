const express = require("express");
const router = express.Router();
const {handleBloodUsage} = require("../Controllers/bloodUsageController");

router.route("/request")
.post(handleBloodUsage);

module.exports = router;