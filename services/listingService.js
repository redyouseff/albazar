const { constants } = require("crypto");
const { uploadMixedImage } = require("../middlewares/uploadImage");
const listingModel = require("../models/listingModel");
const { createOne, getAll, getOne, deletOne, updateOne } = require("./handlersFactory");



const uploadlistingImag=  uploadMixedImage([
   
    {
        name:"images",
        maxCount: 5
    }
])




const creatListing=createOne(listingModel)
const getAllListing=getAll(listingModel);
const getSpesificListing=getOne(listingModel);
const updateListing=updateOne(listingModel);
const deleteListing=deletOne(listingModel)





module.exports={creatListing,uploadlistingImag,getAllListing,getSpesificListing,deleteListing,updateListing}


