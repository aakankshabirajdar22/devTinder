const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
    "mongodb+srv://aakankshabirajdar22_db_user:9Vn5v08t05AcZyBB@cluster0.3zlml78.mongodb.net/"
);
}

module.exports =connectDB;

