const express=require("express");
const { creatListing, uploadlistingImag, getAllListing, getSpesificListing, updateListing, deleteListing } = require("../services/listingService");

const router=express.Router();



router.route('/').post(uploadlistingImag,creatListing)
.get(getAllListing)
router.route("/:id").get(getSpesificListing)
.put(uploadlistingImag,updateListing)
.delete(deleteListing)


module.exports=router;





