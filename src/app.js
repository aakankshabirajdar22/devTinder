const express = require('express');

const connectDB = require("./config/database");
const req = require('express/lib/request');
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    try {

        //validation of data
        validateSignUpData(req);

        //encrypt the password
        const {firstName, lastName, email, password} = req.body;

        const passwordHash = await bcrypt.hash(password , 10);

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

app.post("/login", async (req,res)=>{

    try{

        const {email, password} =req.body;

        const user = await User.findOne({email: email});
        if(!user){
            throw new Error("Email is not present in DB");

        };

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){
            res.send("User Login Successfully!!");
        }else{
            throw new Error("User Login Failed");
        }

    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }

});

//Get user by email
app.get("/user", async (req, res) => {
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
app.get("/feed", async (req, res) => {
    try {
        const user = await User.find();
        res.send(user);
    } catch (err) {
        res.status(400).send("Something Went Wrong");
    }
});

//delete user 
app.delete("/user", async(req,res)=>{
     const userId = req.body.userId;
  try {

        const user = await User.findByIdAndDelete(userId);
        res.send("Deleted User Successfully");
    } catch (err) {
        res.status(400).send("Something Went Wrong");
    }
   
});

//update the user data
app.patch("/user" , async(req, res)=>{
     const userId = req.body.userId;
     const data = req.body; 
       try {

        const ALLOWED_UPDATES =[
            "userId",
            "photoUrl",
            "about",
            "gender",
            "skills",
        ];

        const isUpdateAllowed = Object.keys(data).every((k)=>
            ALLOWED_UPDATES.includes(k)
        );

        if(!isUpdateAllowed){
            throw new Error("update not allowed");
        }

       const user = await User.findByIdAndUpdate({_id :userId}, data, {
        returnDocument:"after",
        runValidators:true,
       });
        res.send("Updated User Successfully");

    } catch (err) {
        res.status(400).send("Update Failed: " + err.message);
    }
});


//Database Connection
connectDB()
    .then(() => {
        console.log("Database Connection Established");
        app.listen(3000, () => {
            console.log("Server is successfully listening on port 3000");
        });
    }).catch(err => {
        console.log("Database Connection Failed");
    });

