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
    const senderSocketId=getReceiverSocketId(senderId);


    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",message);
        
    }

    
    if(receiverSocketId){
      io.to(receiverSocketId).emit("updateSidebar");
    }
    if(senderSocketId){
      io.to(senderSocketId).emit("updateSidebar");
    }


    res.status(200).json({message});
    
    
})





const getUsersForSidebar = asyncHandler(async (req, res, next) => {
  const loggedInUserId = req.currentUser._id;

  const usersWithLastMessage = await messageModel.aggregate([
    {
      $match: {
        $or: [
          { senderId: loggedInUserId },
          { receiverId: loggedInUserId }
        ]
      }
    },
    {
      $addFields: {
        chatKey: {
          $cond: {
            if: { $gt: ["$senderId", "$receiverId"] },
            then: { $concat: [{ $toString: "$senderId" }, "_", { $toString: "$receiverId" }] },
            else: { $concat: [{ $toString: "$receiverId" }, "_", { $toString: "$senderId" }] }
          }
        }
      }
    },
    {
      $sort: { createdAt: -1 } // Sorting messages to get the latest first
    },
    {
      $group: {
        _id: "$chatKey", // Grouping messages to get the last one per conversation
        lastMessage: { $first: "$$ROOT" } // Getting the latest message in each chat
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "lastMessage.senderId",
        foreignField: "_id",
        as: "senderUser"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "lastMessage.receiverId",
        foreignField: "_id",
        as: "receiverUser"
      }
    },
    {
      $unwind: "$senderUser"
    },
    {
      $unwind: "$receiverUser"
    },
    {
      $project: {
        _id: {
          $cond: {
            if: { $eq: ["$lastMessage.senderId", loggedInUserId] },
            then: "$receiverUser._id",
            else: "$senderUser._id"
          }
        },
        firstname: {
          $cond: {
            if: { $eq: ["$lastMessage.senderId", loggedInUserId] },
            then: "$receiverUser.firstname",
            else: "$senderUser.firstname"
          }
        },
        lastname: {
          $cond: {
            if: { $eq: ["$lastMessage.senderId", loggedInUserId] },
            then: "$receiverUser.lastname",
            else: "$senderUser.lastname"
          }
        },
        email: {
          $cond: {
            if: { $eq: ["$lastMessage.senderId", loggedInUserId] },
            then: "$receiverUser.email",
            else: "$senderUser.email"
          }
        },
        profileImage: {
          $cond: {
            if: { $eq: ["$lastMessage.senderId", loggedInUserId] },
            then: { $concat: [process.env.BASE_URL, "/users/", "$receiverUser.profileImage"] },
            else: { $concat: [process.env.BASE_URL, "/users/", "$senderUser.profileImage"] }
          }
        },
        lastMessage: {
          text: "$lastMessage.text",
          createdAt: "$lastMessage.createdAt",
          senderId: "$lastMessage.senderId"
        }
      }
    },
    {
      $sort: { "lastMessage.createdAt": -1 } // Sorting conversations by the latest message
    }
  ]);

  res.status(200).json(usersWithLastMessage);
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

