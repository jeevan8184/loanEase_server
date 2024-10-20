
import mongoose from "mongoose";
import { model,Schema } from "mongoose";

const UserSchema=new Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePic:{
        type:String,
        default:'https://res.cloudinary.com/doxykd1yk/image/upload/v1729190573/cugsnsphbzz5bhs6ojap.png',
    },
    role:{
        type:String,
        enum:['customer','admin'],
        default:'customer'
    },
    phoneNo:{
        type:String,
    },
    gender:{
        type:String,
        enum:['Male','Female'],
    },
    myLoans:[{
        type:Schema.Types.ObjectId,
        ref:'Loan'
    }]
})

const User=model('User',UserSchema) || mongoose.models(User);

export default User;


