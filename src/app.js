const express = require('express');

const app = express();

app.get("/user",(req, res)=>{
    res.send({firstname:"Aakanksha", lastname:"Birajdar"});
});

app.post("/user", (req, res)=>{
     res.send("Data Successfully saved to the database");
});
// app.use("/test", (req, res)=>{
//     res.send("Hello from server!");
// });

// app.use("/hello", (req, res)=>{
//     res.send("Hello Hello Hello!");
// });


app.listen(3000, ()=>{
    console.log("Server is successfully listening on port 3000");
});