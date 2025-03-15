const express=require("express");
const { sendMessage, getUsersForSidebar, getMessages } = require("../services/messageServices");
const { protect } = require("../services/authServices");
const router=express.Router();

router.route("/users").get(protect,getUsersForSidebar)

router.route("/:id").post(protect,sendMessage)
.get(protect,getMessages)





module.exports=router;