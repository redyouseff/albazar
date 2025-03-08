
const userRoute=require("./userRoute")
const authRoute=require("./authRoute")
const categoreRoute=require("./categoreRoute")
const listingRoute=require("./listingRoute");
const reveiwRoute=require("./reveiwRoute")

const mountRoute=(app)=>{
    app.use("/api/user",userRoute);
    app.use("/api/auth",authRoute); 
    app.use("/api/categore",categoreRoute)
    app.use("/api/listing",listingRoute)
    app.use("/api/reveiw",reveiwRoute);
    

    
}

module.exports=mountRoute