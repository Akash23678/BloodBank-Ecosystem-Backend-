const donationModel = require("../Models/donations");


async function calculateCoolingPeriod(id){
    const currDate = new Date();
    
    const lastDonation = await donationModel.findOne({
        donor_id:id,
    }, null, { sort: {donated_date : -1} })   //based on descending order

    if(!lastDonation){
        return 10000;   // if no lastDonation found means this his/her 1st donation
    }

    const days = differenceInDays(currDate, lastDonation.donated_date);
    
    return days;
}

//This is the formula To calculate Days between two days 

function differenceInDays(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);

    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

    return diffDays;
}
module.exports = {
    calculateCoolingPeriod,
    differenceInDays,
}

