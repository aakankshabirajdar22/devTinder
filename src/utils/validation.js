const validator = require("validator");

const validateSignUpData = (req) => {

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    } else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("First name must be 4 - 50 Character");
    } else if (!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please Enter Strong Password!");
    }
}
const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "email", "photoUrl", "gender", "age", "about", "skills"];

    const editAllowed = Object.keys(req.body).every(field => 
        allowedEditFields.includes(field)); 

    return editAllowed;
};

module.exports = {
    validateSignUpData, validateEditProfileData
}