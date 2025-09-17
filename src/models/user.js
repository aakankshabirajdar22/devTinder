const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const validator = require("validator");

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
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid Email Adddress" + value);
                }
            }
        },
        password:{
            type: String,
            required : true,
              validate(value){
                if(!validator.isURL(value)){
                    throw new Error("Enter a strong Password" + value);
                }
            }
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
             validate(value){
                if(!validator.isURL(value)){
                    throw new Error("Invalid URL" + value);
                }
            }
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
