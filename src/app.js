const express = require('express');

const connectDB = require("./config/database");
const req = require('express/lib/request');
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User Added Succesfully");
    } catch (err) {
        res.status(400).send("something Went wrong didnt save user");
    }

})

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

app.delete("/user", async(req,res)=>{
     const userId = req.body.userId;
  try {

        const user = await User.findByIdAndDelete(userId);
        res.send("Deleted User Successfully");
    } catch (err) {
        res.status(400).send("Something Went Wrong");
    }
   
});

app.patch("/user" , async(req, res)=>{
     const userId = req.body.userId;
     const data = req.body; 
       try {

       await User.findByIdAndUpdate({_id :userId}, data);
        res.send("Updated User Successfully");

    } catch (err) {
        res.status(400).send("Something Went Wrong");
    }
});

connectDB()
    .then(() => {
        console.log("Database Connection Established");
        app.listen(3000, () => {
            console.log("Server is successfully listening on port 3000");
        });
    }).catch(err => {
        console.log("Database Connection Failed");
    });

