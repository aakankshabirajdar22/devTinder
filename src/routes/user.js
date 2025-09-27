const express = require("express");
const User = require("../models/user");
const userRouter = express.Router();

//Get user by email
userRouter.get("/user", async (req, res) => {
    const userEmail = req.body.email;

    try {
        const user = await User.find({ email: userEmail });
        if (user.length == 0) {
            res.status(404).send("User Not Found");
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(400).send("Something Went Wrong");
    }
});

//Feed API - get all users from the database
userRouter.get("/feed", async (req, res) => {
    try {
        const user = await User.find();
        res.send(user);
    } catch (err) {
        res.status(400).send("Something Went Wrong");
    }
});

//delete user 
userRouter.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {

        const user = await User.findByIdAndDelete(userId);
        res.send("Deleted User Successfully");
    } catch (err) {
        res.status(400).send("Something Went Wrong");
    }

});

//update the user data
userRouter.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {

        const ALLOWED_UPDATES = [
            "userId",
            "photoUrl",
            "about",
            "gender",
            "skills",
        ];

        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );

        if (!isUpdateAllowed) {
            throw new Error("update not allowed");
        }

        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "after",
            runValidators: true,
        });
        res.send("Updated User Successfully");

    } catch (err) {
        res.status(400).send("Update Failed: " + err.message);
    }
});

module.exports= userRouter;