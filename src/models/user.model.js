import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { env } from 'process';

const userSchema = new monogoose.Schema({

    username:{
        type: String,
        required : true,
        unique : true,
        index : true,
        trim : true,
        lowercase: true
    },
    email:{
        type: String,
        required : true,
        unique : true,
        trim : true,
        lowercase: true
    },  
    fullname:{
        type: String,
        required : true,
        trim : true,
        index:true
    },
    avatar:{
        type: String,   //cloudinary url
        required : true
    },
    coverImage:{
        type: String,   //cloudinary url
    },
    watchHistory: [
        {
            type : Schema.Types.ObjectId,
            ref :"Video"
        }
    ],
    password :{
        type : String,
        required:[true,'password is required']
    },
    refershToken:{
        type : String
    }
    },{
    timestamps :true
    }
)

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id :this._id,
            email:this.email,
            username:this.username
        },
        env.process.ACCESS_TOKEN_SECRETE,
        {
            expiresIn : env.process.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_EXPIRY,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema);