const asyncHandler = require('express-async-handler');
const messageModel = require('../models/messageModel');
const { getReceiverSocketId, io } = require('../config/socker');
const apiFeatures = require('../utilts/apiFeatures');
const { appError } = require('../utilts/appError');
const userModel = require('../models/userModel');

const sendMessage=asyncHandler(async(req,res,next)=>{

    const { text, image } = req.body;
    const { id: receiverId } = req.params;
   
    const senderId = req.currentUser._id;
    req.body.receiverId=receiverId;
    req.body.senderId=senderId

    const message=await messageModel.create(req.body);

    if(!message){
        return next (new appError("there is erro on creating message",400));
    }

    const receiverSocketId=getReceiverSocketId(receiverId);

    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",message);
        
    }

    res.status(200).json({message});
    
    
})


const getUsersForSidebar = asyncHandler(async (req, res, next) => {
    const loggedInUserId = req.currentUser._id;
  
    // Find users who have exchanged messages with the logged-in user
    const usersWithMessages = await messageModel.aggregate([
      {
        $match: {
          $or: [
            { senderId: loggedInUserId },
            { receiverId: loggedInUserId }
          ]
        }
      },
      {
        $lookup: {
          from: "users", // This is the users collection
          localField: "senderId",
          foreignField: "_id",
          as: "senderUser"
        }
      },
      {
        $lookup: {
          from: "users", // This is the users collection
          localField: "receiverId",
          foreignField: "_id",
          as: "receiverUser"
        }
      },
      {
        $project: {
          users: {
            $setUnion: ["$senderUser", "$receiverUser"]
          }
        }
      },
      {
        $unwind: "$users"
      },
      {
        $match: {
          "users._id": { $ne: loggedInUserId }
        }
      },
      {
        $group: {
          _id: "$users._id",
          user: { $first: "$users" }
        }
      }
    ]);
   
  
    // Extract only the user data
    const filteredUsers = usersWithMessages.map(item => item.user);
  
    res.status(200).json(filteredUsers);
  });


const getMessages=asyncHandler(async(req,res,next)=>{
    const message=await messageModel.find({
        $or:[
            {receiverId:req.params.id,senderId:req.currentUser._id},
            {receiverId:req.currentUser._id,senderId:req.params.id},

        ]
    })


   
    res.status(200).json(message)  

})






module.exports={sendMessage,getUsersForSidebar,getMessages};

