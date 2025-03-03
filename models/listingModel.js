const mongoose=require("mongoose");

const listingShema=mongoose.Schema({
   
    title:{
        type:String,
        required:[true,"title is required "],
        trim:true,
        minLength:[5,"too short title"],
        maxLength:[200,"too long title "]
    },
    slug:{
        type:String,
        required:true,
        lowercase:true
    },
    description:{
        type:String,
        required:[true,"description is required"],
        minLength:[30,"too short descripton "]

    },
    sold:{
        Boolean,
        default:false
    },

    price:{
        type:Number,
        required:[true,"price is required "],
        trim:true,
    },
    images:[String],
    imageCover:{
        type:String,
        required:[true,"image cover is required"]
    },

    categore:{
        type:mongoose.Schema.ObjectId,
        ref:"categore",
        required:[true,"categore is required"]
    },
    


    ratingAverage:{
        type:Number,
        min:[1,"the number must be greater than 1"],
        max:[5,"the number cant be greater than 5"]

    },
     
    ratingQuantity:{
        type:Number,
        default:0
    },


    

},{timestamps:true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


const listingModel=mongoose.model("listing",listingShema);

module.exports=listingModel;