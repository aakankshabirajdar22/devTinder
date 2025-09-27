const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req, res) => {
    try {

        //validation of data
        validateSignUpData(req);

        //encrypt the password
        const { firstName, lastName, email, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        console.log(passwordHash);

        //creating new instance of user model
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });

        await user.save();
        res.send("User Added Succesfully");
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }

});

authRouter.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid Credentials");
        };

        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {

            const token = await user.getJWT();

            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send("User Login Successfully!!");
        } else {
            throw new Error("User Login Failed");
        }

    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }

});

module.exports = authRouter;