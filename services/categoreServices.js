
const asyncHandler = require('express-async-handler')
const { uploadSingleImage } = require('../middlewares/uploadImage')
const sharp =require("sharp")
const { v4: uuidv4 } = require('uuid');
const categoreModel = require('../models/categoreModel')
const { createOne, getOne } = require('./handlersFactory')


const uploadCategoreImage=uploadSingleImage("image")

const reasizeImage=asyncHandler(async(req,res,next)=>{

    const fileName=`categore-${uuidv4()}-${Date.now()}.jpeg`

    sharp(req.file.buffer).resize(600,600)
    .toFormat("jpeg")
    .jpeg({quality:90})
    .toFile(`uploads/categore/${fileName}`)
    req.body.image=fileName;
    next();

})


const createCategore=createOne(categoreModel)
const getSpesificCategore=getOne(categoreModel)



module.exports=  {uploadCategoreImage,reasizeImage,createCategore,getSpesificCategore}




