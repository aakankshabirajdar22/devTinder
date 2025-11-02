const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const req = require("express/lib/request");
const userRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");

const   USER_SAFE_DATA=  "firstName lastName photoUrl gender age about skills";

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
// userRouter.get("/feed", async (req, res) => {
//     try {
//         const user = await User.find();
//         res.send(user);
//     } catch (err) {
//         res.status(400).send("Something Went Wrong");
//     }
// });

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

userRouter.get("/user/requests/received", userAuth, async(req, res)=>{

    try{

        const loggedInUSer = req.user;

        const ConnectionRequests = await ConnectionRequestModel.find({
            toUserId : loggedInUSer._id,
            
        }).populate(
            "fromUserId" , 
           USER_SAFE_DATA
        );
        res.json({message: "Data Fetched Successfully", data: ConnectionRequests })
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections" , userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            $or:[
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"},
            ]
        }).populate(
            "fromUserId" , 
           USER_SAFE_DATA
        );

        const data = connectionRequests.map((row) => 
            {
                 if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                    return row.toUserId; 
                } else {
                    return row.fromUserId; 
                }
            }
           );

        res.json({
            data
        });

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/feed", userAuth, async(req,res)=> {
    try{

        const loggedInUSer = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ?50 : limit;
        const skip = (page-1)*limit;

        const connectionRequests = await ConnectionRequestModel.find({
            $or : [{ fromUserId :loggedInUSer._id}, {toUserId : loggedInUSer._id}],
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                {_id : { $nin: Array.from(hideUserFromFeed)} },
                {_id : { $ne: loggedInUSer._id} },
            ],  
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.send(users);

    }catch(err){
        res.status(400).json({message: err.message});
    }
});
module.exports= userRouter;