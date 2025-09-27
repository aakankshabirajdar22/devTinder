const express =require("express");
const { userAuth } = require("../middleware/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async(req,res)=>{
    try{
        const user= req.user;

        res.send(user);


    }catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

module.exports = requestRouter;