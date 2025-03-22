const express =require("express");
const  {updateLoggedUserData,
    deleteLoggedUserData,
    creagteUser,getSpesificUser,updateUser,deleteUser,getAllUser,reasizeImage,uploadImage,getLoggedUser,updateLoggedUserPassword} = require("../services/userServices");
const { protect, allowedTo } = require("../services/authServices");
const { changePasswordValidator } = require("../utilts/validator/userVlidator");
const router=express.Router();



router.route("/getme").get(protect,getLoggedUser,getSpesificUser)
router.route("/changeMyPassword").post(protect,changePasswordValidator,updateLoggedUserPassword)
router.route("/updateMyData").put(protect,updateLoggedUserData)
router.route("/deleteMyData").put(protect,deleteLoggedUserData)


router.route("/").post(uploadImage,reasizeImage,creagteUser);
router.route("/").get(getAllUser)
router.route("/:id").get(getSpesificUser);
router.route("/:id").put(uploadImage,reasizeImage,updateUser);
router.route("/:id").delete(deleteUser);





module.exports=router