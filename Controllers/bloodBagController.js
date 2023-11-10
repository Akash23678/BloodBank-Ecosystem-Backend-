const  bloodBagModel = require("../Models/bloodBags")

const handleAddBloodBag = async (donation, blood_type, qty, currDate)=>{

    const bloodBag = await bloodBagModel.findOne(
    {
        donated_date : donation.donated_date,
        blood_type: blood_type
    })
    if(bloodBag){   // if found/already exist with same bloodtype & date
        const updatedQty = bloodBag.qty + qty;
        bloodBag.qty = updatedQty;
        await bloodBag.save();
        
        console.log("new qty in BloodBag-",updatedQty);
        
        return;
    }

    bloodBagModel.create({
        donated_date: currDate,
        qty:qty,
        blood_type: blood_type,
        
    })
    console.log("Blood Bag Added");
}

//GET All BloodBags 
const handleGetAllbloodBags = async (req, res) => {
    const bloodBags = await bloodBagModel.find({});
    if(bloodBags.length == 0){
        return res.json({msg: "No BloodBags Found"});
    }
    return res.json({
        msg : "We Found Few BloodBags",
        bloodBags,
    })
}

module.exports = {
    handleAddBloodBag,
    handleGetAllbloodBags
}