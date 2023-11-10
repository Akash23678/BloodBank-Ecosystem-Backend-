const donationModel = require("../Models/donations");
const donorModel = require("../Models/donors");
const bloodBagModel = require("../Models/bloodBags");
const { handleAddBloodBag }= require("./bloodBagController");

//validation Import
const { calculateAge } = require("../Validations/ageCalculation");
const { calculateCoolingPeriod } = require("../Validations/daysCalculation");


//POST Request----------------------------------------------------------

const handleAddDonation = async (req, res)=>{
    
    const id = req.body.donorId;
    const qty = req.body.qty;
    console.log(id);
    const donor = await donorModel.findOne({_id:id});
    
    if(!donor){
        return res.status(404).json({msg:"Donor Not Found pls register YourSelf"});
    }
   
//age calculate
    const age = calculateAge(donor.date_of_birth);
    if(!(age >=18 && age<65)){
        console.log("Your age-", age);
        return res.json({msg:"You are not qualified to donate Blood By Age"})
    }
//Cooling Period validation
    const coolingPeriod = await calculateCoolingPeriod(id);
    if(coolingPeriod < 60){
        console.log("not eligible wait for more days", coolingPeriod);
        return res.json({msg:"You can't donate blood as Your cooling period not yet has been completed Wait for 60 Days Gap"});
    }
//Quantity check
    if(qty>400){
        return res.json({msg:`You can't donate ${qty}ml blood`});
    }
//Inserting into Donation
    let currDate = new Date();
    currDate = currDate.getFullYear()+'/'+(currDate.getMonth()+1)+'/'+currDate.getDate(); 
console.log(currDate);

    const donation = await donationModel.create({
        donor_id:id,
        donated_date: currDate,
        qty:qty,
        blood_type: donor.blood_type
    })

    //Inseerting into BloodBag
    const bloodBag= await handleAddBloodBag(donation, donor.blood_type, qty, currDate);
    // console.log("added to bloodBag", );
    return res.status(201).json({
        msg:"Successfully Donated & bloodBag added",
        donation,
    })
}



// GET All Donations--------------------------------------------------------------------------------------- 
const handleGetAllDonations = async (req, res)=>{
    const allDonations = await donationModel.find({});

    if(allDonations.length == 0){
        return res.json({
            msg:"No Donations Found Till Now"
        })
    }
    return res.json({
        allDonations
    })
}


//GET History Of Donor All Donations
const handleGetHistoryOfDonor = async (req, res) => {
    const id = req.params.donorId;

// Donor Existance Check
    const donor = await donorModel.findById(id);
    if(!donor){
        return res.status(404).json({
            msg:"Donor Was Not Found With the Specified donorId"
        })
    }

// Then check Donations history of Donor in "DonationModel"
    const allDonations = await donationModel.find({ donor_id: id }); 
    
// Result Response creation
    const result = {...donor.toObject(), donation_history:allDonations};
    
    const donationLen = allDonations.length;
    if(donationLen == 0){
        return res.json({msg: "No Donation Record Found for Specified ID", result})
    }
    return res.json({msg: ` We have Found ${donationLen} Donation Records for Your Given ID`, result})

}


module.exports={
    handleAddDonation,
    handleGetAllDonations,
    handleGetHistoryOfDonor
}