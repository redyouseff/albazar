const express=require("express");
const  {uploadCategoreImage,reasizeImage,createCategore, getSpesificCategore} = require("../services/categoreServices");
const router=express.Router();


router.route("/").post(uploadCategoreImage,reasizeImage,createCategore)

router.route("/:id").get(getSpesificCategore)

module.exports=router