const mongoose=require("mongoose");
const listingModel = require("./listingModel");

const reviewSchema=mongoose.Schema({

    title:{
        type:String

    },
    rating:{
        type:Number,
        min:[1,"min rating is 1"],
        max:[5,"max rating is 5"],
        required:[true,"rating is requred"]
        
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:[true,"review must belong to the user "]
    },
    listing:{
        type:mongoose.Schema.ObjectId,
        ref:"listing",
        required:[true,"reveiw must belong to listing"]
    }

},{
    timestamps:true
},{timestamps:true})

reviewSchema.pre(/^find/,function(next){
    this.populate({path:"user",select:"firstname  lastname  email phone active"})
    next();

})


reviewSchema.statics.calcRatingAverageAndRatingQuantity= async function (listingId) {

    const result=await this.aggregate([
        {$match:{listing:listingId}},
        {
            $group:{
                _id:`${listingId}`,
                ratingAverage:{$avg:`$rating`},
                ratingQuantity:{$sum:1}

            }
        }
    ])

  


    if(result.length>0){
     
         const list = await listingModel.findByIdAndUpdate(listingId,{
            "rating average":result[0].ratingAverage,
            "rating quantity":result[0].ratingQuantity,

        })
     
        
    }

    else{
        await listingModel.findByIdAndUpdate(listingId,{
            ratingAverage:0,
            ratingQuantity:0,
        })
    }

    
}

reviewSchema.post("save",async function(){
    await this.constructor.calcRatingAverageAndRatingQuantity(this.listing)
})
reviewSchema.post("remover",async function () {
    await this.constructor.calcRatingAverageAndRatingQuantity(this.listing)

})




const reveiwModel=mongoose.model("review",reviewSchema)

module.exports=reveiwModel;


