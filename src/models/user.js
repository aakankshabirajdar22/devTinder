const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const userSchema =  new mongoose.Schema(
    {
        firstName: {
            type: String,
            required : true,
            minlength: 4,
            maxlength: 50,
        },
        lastName:{
            type: String
        },
        email:{
            type: String,
            lowercase : true,
            required: true,
            unique : true,
            trim : true,
        },
        password:{
            type: String,
            required : true,
        },
        age:{
            type:Number,
            min:18,
        },
        gender:{
            type:String,
            validate(value){
                if(!["male", "female", "others"].includes(value)){
                    throw new Error("Gender Data is not valid");
                }
            },
        },
        photoUrl:{
            type: String,
        },
        about:{
            type:String,
            default:"This is default about of the user",
        },
        skills:{
            type:[String],
        }
    },
    {
        timestamps : true,
    }
);

const userModel = mongoose.model("User", userSchema);

module.exports= userModel;
