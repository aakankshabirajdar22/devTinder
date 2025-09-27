const express = require('express');
const connectDB = require("./config/database");
const req = require('express/lib/request');
// const User = require("./models/user");
// const { validateSignUpData } = require("./utils/validation");
// const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
// const { userAuth } = require("./middleware/auth");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


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

