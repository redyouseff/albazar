
const asyncHandler = require('express-async-handler')
const userModel = require('../models/userModel')
const { appError } = require('../appError')
const { uploadSingleImage } = require('../middlewares/uploadImage')
const sharp =require("sharp")
const { v4: uuidv4 } = require('uuid');



const uploadImage=uploadSingleImage("profileImage")

const reasizeImage =asyncHandler(async(req,res,next)=>{
    const fileName=`user-${uuidv4()}-${Date.now()}.jpeg`;
    sharp(req.file.buffer).resize(600,600)
    .toFormat("jpeg")
    .jpeg({quality:90})
    .toFile(`uploads/users/${fileName}`)
    req.body.profileImage=fileName;
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



const getAllUser=asyncHandler(async(req,res,next)=>{
    const user=await userModel.find()
    if(!user){
        next (new appError("there is no users ",400));
    }
    res.status(200).json({state:"success",length:user.length,data:user})
})


const updateUser=asyncHandler(async(req,res,next)=>{
    const user= await  userModel.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
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




module.exports=  {creagteUser,getSpesificUser,updateUser,deleteUser,getAllUser,reasizeImage,uploadImage}



