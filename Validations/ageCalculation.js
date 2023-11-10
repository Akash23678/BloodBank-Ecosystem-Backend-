//age Calucation
function calculateAge (birthDate) {
    birthDate = new Date(birthDate);
    currDate = new Date();

    var years = (currDate.getFullYear() - birthDate.getFullYear());

    if (currDate.getMonth() < birthDate.getMonth() || 
        currDate.getMonth() == birthDate.getMonth() && currDate.getDate() < birthDate.getDate()) {
        years--;
    }

    return years;
}

module.exports = {
    calculateAge,
}