const { constants } = require("crypto");
const { uploadMixedImage } = require("../middlewares/uploadImage");
const listingModel = require("../models/listingModel");
const { createOne, getAll, getOne, deletOne, updateOne } = require("./handlersFactory");
const asyncHandler = require('express-async-handler')
const { v4: uuidv4 } = require('uuid');
const sharp = require("sharp");
const { appError } = require("../utilts/appError");



const uploadlistingImag=  uploadMixedImage([
   
    {
        name:"images",
        maxCount: 20
    }
])

const reasizeImage=asyncHandler(async(req,res,next)=>{

    if(req.files.images){
        req.body.images=[];
        await Promise.all(
            req.files.images.map(async(item,index)=>{
                const fileName=`listing-${uuidv4()}-${Date.now()}-${index+1}.jpeg`;
                await sharp(item.buffer)
                .resize(2000,1333)
                .toFormat("jpeg")
                .jpeg({quality:90})
                .toFile(`uploads/listing/${fileName}`)
                req.body.images.push(fileName)
            })
        )
    }
  
    next();
})




const creatListing=createOne(listingModel)
const getAllListing=getAll(listingModel);
const getSpesificListing=getOne(listingModel);
const updateListing=updateOne(listingModel);
const deleteListing=deletOne(listingModel)
const getLoggedUserListing=asyncHandler(async(req,res,next)=>{
    const listing =await listingModel.find({user:req.currentUser._id});
    if (!listing){
        return next (new appError("there is no listing for this user"))
    }
    res.status(200).json({data:listing})
})





module.exports={creatListing,uploadlistingImag,getAllListing,getSpesificListing,deleteListing,updateListing,reasizeImage,getLoggedUserListing}


