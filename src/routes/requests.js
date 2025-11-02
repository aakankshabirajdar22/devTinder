const express =require("express");
const mongoose = require("mongoose");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();
const User = require("../models/user");


requestRouter.post("/request/send/:status/:toUserId"
    , userAuth, async(req,res)=>{
    try{
        const fromUserId= req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                messsage:"Invalid Status Type: "+ status
            }); 
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({
                messsage:"User not found",
            }); 
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId:fromUserId},
            ],
        });

        if(existingConnectionRequest){
            return res.status(400).json({
                messsage:"Connection Is Already Exists"
            }); 
        }

        const connectionRequest = new ConnectionRequest({

            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({
            message:"Connection Request Sent Succesfully !",
            data
        });

    }catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", 
    userAuth,
    async(req,res) => {

        try{
            const loggedInUser = req.user;

            const{status, requestId} = req.params;
 
            const allowedStatus= ["accepted", "rejected"];
            if(!allowedStatus.includes(status))
            {
                return res.status(400).json({message:"Status Not Allowed"});
            }
console.log("requestId valid:", mongoose.Types.ObjectId.isValid(requestId));
console.log("loggedInUser._id valid:", mongoose.Types.ObjectId.isValid(loggedInUser._id));
console.log("loggedInUser._id actual:", loggedInUser._id);
console.log("DB toUserId type:", typeof loggedInUser._id);
console.log(await ConnectionRequest.findById(requestId));
const toUserId = new mongoose.Types.ObjectId(loggedInUser._id.toString());
console.log("toUserId" , toUserId)
            // const connectionRequest = await ConnectionRequest.findOne({
            //     _id : new mongoose.Types.ObjectId(requestId),
            //     toUserId : (loggedInUser._id),
            //     status:"interested"
            // });
            const connectionRequest = await ConnectionRequest.findOne({
  _id: new mongoose.Types.ObjectId(requestId),
  toUserId: new mongoose.Types.ObjectId(loggedInUser._id.toString()),
  status: "interested"
});

            console.log("connectionRequest", connectionRequest);

            if(!connectionRequest){
                return res.status(400).json({message :"Connection Request is not Found"})
            }

            connectionRequest.status= status;

            const data = await connectionRequest.save();

            res.json({message: "Connection Request "+status, data});

        }catch(err){
            res.status(400).send("ERROR: " +err.message);
        } 
        
    }
);

module.exports = requestRouter;        