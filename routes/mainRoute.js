
const userRoute=require("./userRoute")
const authRoute=require("./authRoute")

const mountRoute=(app)=>{
    app.use("/api/user",userRoute);
    app.use("/api/auth",authRoute); 
    


}

module.exports=mountRoute