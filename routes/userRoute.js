const express =require("express");
const  {creagteUser,getSpesificUser,updateUser,deleteUser,getAllUser,reasizeImage,uploadImage} = require("../services/userServices");
const { protect } = require("../services/authServices");
const router=express.Router();



router.route("/").post(uploadImage,reasizeImage,creagteUser);
router.route("/").get(getAllUser)
router.route("/:id").get(getSpesificUser);
router.route("/:id").put(updateUser);
router.route("/:id").delete(deleteUser);




module.exports=router