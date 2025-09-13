const express = require('express');

const connectDB = require("./config/database");
const req = require('express/lib/request');
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async(req, res) =>{
     const user = new User(req.body);

     try{
         await user.save();
        res.send("User Added Succesfully");
     }catch(err){
        res.status(400).send("something Went wrong didnt save user");
     }
    
})

connectDB()
.then(()=>{
    console.log("Database Connection Established");
    app.listen(3000, ()=>{
    console.log("Server is successfully listening on port 3000");
});
}).catch(err => {
    console.log("Database Connection Failed");
});

 
// 

// const { adminAuth} = require("./middleware/auth");

// app.use("/admin", adminAuth);

// app.get("/user",(req, res)=>{
//     res.send({firstname:"Aakanksha", lastname:"Birajdar"});
// });

// app.post("/user", (req, res)=>{
//      res.send("Data Successfully saved to the database");
// });
// app.use("/test", (req, res)=>{
//     res.send("Hello from server!");
// });

// app.use("/hello", (req, res)=>{
//     res.send("Hello Hello Hello!");
// });


// app.listen(3000, ()=>{
//     console.log("Server is successfully listening on port 3000");
// });