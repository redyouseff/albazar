
const userRoute=require("./userRoute")
const authRoute=require("./authRoute")
const categoreRoute=require("./categoreRoute")

const mountRoute=(app)=>{
    app.use("/api/user",userRoute);
    app.use("/api/auth",authRoute); 
    app.use("/api/categore",categoreRoute)
    


}

module.exports=mountRoute