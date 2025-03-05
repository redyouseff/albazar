const mongoose=require("mongoose");
const bcrypt = require('bcrypt');

const userShema=  mongoose.Schema({
    firstname:{
        type:String,
        required:[true,"first name is required"],
        trim:true
    },
    lastname:{
        type:String,
        required:[true,"last name is required"],
        trim:true
    },
    about:{
        type:String
    },
    slug:{
        type:String,
        lowercase:true,
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        lowercase:true,
    },
    phone:{
    type:Number
    },
    profileImage:String,
    password:{
        type:String,
        required:[true,"password is required"],
        minLength:[6,"too short password"]
    },
    role:{
        type:String,
        enum:["user","seller","admin"],
        default:"user"
    },
    active:{
        type:Boolean,
        default:true,
    },
    passwordChangedAt:{
        type:Date,
    },

    passwordResetCode:String,
    passwordResetExpires:Date,
    passwordResetVerified:Boolean,
    

    wishlist:[{
        type:mongoose.Schema.ObjectId,
       
    }],


    addresses:[{
        id:{type:mongoose.Schema.Types.ObjectId},
        alias:String,
        details:String,
        phone:String,
        city:String,
        postalCode:String
    }]



},{timestamps:true})


const setImageUrl=(doc)=>{
 
    if(doc.profileImage){
        const imageUrl=`${process.env.BASE_URL}/users/${doc.profileImage}`;
        doc.profileImage=imageUrl;
    }
}


userShema.post("init",(doc)=>{
    setImageUrl(doc);
})
userShema.post("save",(doc)=>{
    setImageUrl(doc)
})

userShema.pre("save",async function(next){
  
    if(!this.isModified("password")){
      
        return next();
    }
    
    this.password= await bcrypt.hash(this.password,12);
    next();

})   


const userModel=mongoose.model("user",userShema)




module.exports=userModel;