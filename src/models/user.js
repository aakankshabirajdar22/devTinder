const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");


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
                if(validator.isURL(value)){
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

userSchema.methods.getJWT = async function(){

    const user= this;
    const token = await jwt.sign({_id: user._id}, "Dev@Tinder$790", {
                expiresIn:"7d",
            });
            
    return token;

};

userSchema.methods.validatePassword = async function(passwordInputByUser){

    const user = this;
    const passwordhash = user.password;

    const isPasswordValid = await  bcrypt.compare(
        passwordInputByUser, passwordhash
    );
    
    return isPasswordValid;

};

const userModel = mongoose.model("User", userSchema);

module.exports= userModel;
