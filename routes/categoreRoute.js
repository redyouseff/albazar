const express=require("express");
const  {uploadCategoreImage,reasizeImage,createCategore} = require("../services/categoreServices");
const router=express.Router();


router.route("/").post(uploadCategoreImage,reasizeImage,createCategore)

module.exports=router