
const asyncHandler = require('express-async-handler')
const userModel = require('../models/userModel')
const { appError } = require('../utilts/appError')
const { uploadSingleImage } = require('../middlewares/uploadImage')
const sharp =require("sharp")
const { v4: uuidv4 } = require('uuid');
const bcrypt=require("bcrypt")
const createToken = require('../utilts/createToken')
const { getAll } = require('./handlersFactory')



const uploadImage=uploadSingleImage("profileImage")

const reasizeImage =asyncHandler(async(req,res,next)=>{
    const fileName=`user-${uuidv4()}-${Date.now()}.jpeg`;
    
    if(req?.file?.buffer){
        sharp(req.file.buffer).resize(600,600)
        .toFormat("jpeg")
        .jpeg({quality:90})
        .toFile(`uploads/users/${fileName}`)
        req.body.profileImage=fileName;

    }

 
    next();
})



const creagteUser=asyncHandler(async(req,res,next)=>{
const user = await userModel.create(req.body)

res.status(200).json({state:"success",data:user})
    

})



const getSpesificUser=asyncHandler(async(req,res,next)=>{
    const user = await userModel.findById(req.params.id)
    if(!user){
        next(new appError(`there is no user for this id ${req.params.id}`,400))
    }
    res.status(200).json({state:"success",data:user});
})



const getAllUser=getAll(userModel)


const updateUser=asyncHandler(async(req,res,next)=>{
    const user= await  userModel.findByIdAndUpdate(req.params.id,{
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        slug:req.body.slug,
        email:req.body.email,
        phone:req.body.phone,
        role:req.body.role,

    },{new:true})

    if(!user){
        next (new appError(`there is no user for this id ${req.params.id}`,400))
    }


    res.status(200).json({state:"success",data:user});
})


const deleteUser=asyncHandler(async(req,res,next)=>{
    const  user =await userModel.findByIdAndDelete(req.params.id)
    if(!user){
        next (new appErro(`there is no user for this id ${req.params.id}`,400));
    }
    res.status(200).json({message:"user is deleted"});

})

const getLoggedUser=asyncHandler(async(req,res,next)=>{
    req.params.id=req.currentUser._id
    next()
})


const updateLoggedUserPassword =asyncHandler(async(req,res,next)=>{
    const user =await userModel.findByIdAndUpdate(req.currentUser._id,{
        password:await bcrypt.hash(req.body.password,12),
        passwordChangedAt:Date.now()
    },{new:true})
    
    const token=createToken(user._id)
    res.status(200).json({data:user,token:token})


})



const updateLoggedUserData =asyncHandler(async(req,res,next)=>{
    const user=await userModel.findByIdAndUpdate(req.currentUser._id,{
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        phone:req.body.phone


    },{new:true});

    res.status(200).json({data:user})


})


const deleteLoggedUserData =asyncHandler(async(req,res,next)=>{

    const user =await userModel.findByIdAndUpdate(req.currentUser._id,{
        active:false
    })
    res.status(200).json({state:"success"});
})








module.exports=  {creagteUser,getSpesificUser,updateUser,deleteUser,getAllUser,reasizeImage,uploadImage,getLoggedUser,updateLoggedUserPassword
    ,updateLoggedUserData,
    deleteLoggedUserData
}



