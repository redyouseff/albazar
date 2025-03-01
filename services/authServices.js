const asyncHandler = require('express-async-handler')
const userModel = require('../models/userModel')
const createToken = require('../utilts/createToken')
const bcrypt=require("bcrypt")
const { appError } = require('../appError')
let jwt = require('jsonwebtoken');


const signUp=asyncHandler(async(req,res,next)=>{
    const user =await  userModel.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })

    const token=createToken(user._id)
    res.status(200).json({data:user,token:token})

})

const login =asyncHandler(async(req,res,next)=>{
    const user =await userModel.findOne({email:req.body.email})
    if(!user || !(await bcrypt.compare(req.body.password , user.password))){
        next (new appError("email or password is not correct ",500))
    }

    const token=createToken(user._id) 
    res.status(200).json({data:user,token:token})
    
})


const protect=asyncHandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return next (new appError("you are not loged in ",500));
    }
    const decode= jwt.verify(token,process.env.JWT_SECRET_KEY);
    const currentUser=userModel.findById(decode.userId)
    if(!currentUser){
        return  next (new appError("user is nolonger exist ",500) );
    }
    const passChangedTimestamp=parseInt(
        currentUser.passwordChangedAt / 1000,
        10
      );

      if(passChangedTimestamp > decode.iat){
        return next(new appError("you are recently changed your password pleace log again "))
    }

    req.currentUser=currentUser;
    next();

})


const allowedTo=(...roles)=>{
    return asyncHandler(async(req,res,next)=>{
        if(!roles.includes(req.currentUser.role)){
            return next(new appError("you are not allowed to access this route ",500));
        }
        next();

    })
}



module.exports={signUp,login,protect}