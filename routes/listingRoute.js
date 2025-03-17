const express=require("express");
const { creatListing, uploadlistingImag, getAllListing, getSpesificListing, updateListing, deleteListing ,reasizeImage, getLoggedUserListing} = require("../services/listingService");
const { protect } = require("../services/authServices");


const router=express.Router();




router.route("/userListing").get(protect,getLoggedUserListing)
router.route('/').post(protect,uploadlistingImag,reasizeImage,(req,res,next)=>{
    req.body.user=req.currentUser._id;
    next();
},creatListing)
.get(getAllListing)
router.route("/:id").get(getSpesificListing)
.put(uploadlistingImag,updateListing)
.delete(deleteListing)




module.exports=router;





