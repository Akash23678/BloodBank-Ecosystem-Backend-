const bloodUsageModel = require("../Models/bloodUsages")
const bloodGroupMap = require("../matchBloodGroups");



const { differenceInDays } = require("../Validations/daysCalculation");
const bloodBagModel = require("../Models/bloodBags");
const donorModel = require("../Models/donors");
// const { raw } = require("express");

//current Date
let currDate = new Date();
currDate = currDate.getFullYear()+'/'+(currDate.getMonth()+1)+'/'+currDate.getDate(); 

// POST Request for Blood Create BloodUsage
const handleBloodUsage = async (req, res) => {
    const qtyNeeded = req.body.qtyNeeded;
    const ReqBloodType = req.body.bloodType;


    // Qty Check
    if (qtyNeeded <= 0) {
        return res.status(400).json({ message: "Invalid qty " });
    }

    // Matching Blood Grps
    console.log(ReqBloodType);
    const matchBloodGroups = bloodGroupMap[ReqBloodType];
    console.log(matchBloodGroups);

    // Get All BloodBags in ascending order based on donated_date
    let bloodBags = await bloodBagModel.find({}).sort({ donated_date: 1 });

    // Loop Through AllBloodBag Array
    const bloodUsages = []; // where all bloodBag uses for request stores
    let remainingQty = qtyNeeded;

    for (const element of bloodBags) {
        const currBloodType = element.blood_type;
        const qty = element.qty;
        const bloodBagId = element._id;

        if(remainingQty == 0){
            break;
        }
        //check Expiree Days
        const expireDays = differenceInDays(currDate, element.donated_date);
        if(expireDays > 45){
            continue;   //don't consider this bloodBag
        }

        // We check whether currBloodType in bloodBag matches the request bloodType
        if (matchBloodGroups.includes(currBloodType)) {

            if (qty >= remainingQty) {
                // Means we got all needed Blood
                const bloodBag = await createBloodUsage(remainingQty, ReqBloodType, bloodBagId);
                bloodUsages.push(bloodBag);

                if (qty === remainingQty) {
                    await bloodBagModel.deleteOne({ _id: bloodBagId });
                } else {
                    element.qty = (qty - remainingQty);
                    await element.save();
                }
                remainingQty = 0;
                console.log(`We Have found ${qtyNeeded}ml Blood from ${bloodBagId} - bloodBagQty left${qty - remainingQty}`);

            } else {
                // We got partial blood - so we need to remove that bloodBag
                await bloodBagModel.deleteOne({ _id: bloodBagId });
                const bloodBag = await createBloodUsage(remainingQty, ReqBloodType, bloodBagId);
                remainingQty -= qty;

                bloodUsages.push(bloodBag);

            }
        }
    }
console.log(remainingQty);
    // If We don't have request bloodType in bloodBags

    const donors = await donorModel.find({ blood_type: {$in : matchBloodGroups} });

    // Response sending
    if (bloodUsages.length == 0) {
        if (donors.length == 0) {

            return res.json({
                success: false,
                message: "We have not found blood in the blood bank, and no donor with the blood type found"
            })
        }
        return res.json({ message: "We have not found blood in the blood bank, so we have below list of donors", donors });
    }

    if (remainingQty > 0) { // we found few blood from bloodBank
        if (donors.length == 0) {
            return res.json({
                msg1: `We have found ${qtyNeeded - remainingQty}ml in the blood bank`,
                bloodUsages,
                msg2: `For remaining ${remainingQty}ml we cannot find list of Donors`
            })
        } else {
            return res.json({
                msg1: `We have found ${qtyNeeded - remainingQty}ml in the blood bank`,
                bloodUsages,
                msg2: `For remaining ${remainingQty}ml, But we found list of Donors`, donors
            })
        }
    }

    return res.json({ msg: `we found All requested blood`, bloodUsages })

}

// Creating BloodUsage 
async function createBloodUsage(remainingQty, bloodType, bloodBagId){
    
    const bloodUsage = await bloodUsageModel.create({
        qty : remainingQty,
        blood_type: bloodType,
        used_date : currDate,
        bloodBag_id :  bloodBagId,
    })
    return bloodUsage;
}

module.exports = {
    handleBloodUsage
}