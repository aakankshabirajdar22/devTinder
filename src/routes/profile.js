const express = require("express");
const { userAuth } = require("../middleware/auth");
const profileRouter = express.Router();
const { validateEditProfileData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.send(user);
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req,res)=>{

    try {
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request"); 
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key)=> (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.json( {
            message : `${loggedInUser.firstName} User Profile Updated Successful !!"`,
            data: loggedInUser
        });

    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
}); 

profileRouter.patch("/profile/change-password", userAuth, async (req, res) => {
    try {
        const { newPassword } = req.body;
        const loggedInUser = req.user;

        if (!newPassword) {
            throw new Error("New password is required");
        }

        // Validate password strength
        if (!validator.isStrongPassword(newPassword)) {
            throw new Error("Password must be strong: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol");
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = hashedPassword;

        // Save updated user
        await loggedInUser.save();

        res.json({
            message: "Password updated successfully",
            user: {
                firstName: loggedInUser.firstName,
                email: loggedInUser.email
            }
        });
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});


module.exports = profileRouter;