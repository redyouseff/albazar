const express=require("express");
const dotenv=require("dotenv")
const  cors=require("cors");
const compression=require("compression")
const path =require("path");
const {appError}=require("./utilts/appError")
const {dbConnection}=require('./config/dbConnection');
const { globelError } = require("./middlewares/globelError");
const mountRoute = require("./routes/mainRoute");
const { app, server } = require("./config/socker");
const { Vonage } = require('@vonage/server-sdk')


const vonage = new Vonage({
  apiKey: "916538e5",
  apiSecret: "jaWCkxLECq94kkqz"
})

const from = "201026964097"; // Your Vonage virtual number
const to = "201004682040"; // Egyptian number with +20
const text = 'Hello from Vonage!';

async function sendSMS() {
  try {
    const resp = await vonage.sms.send({ to, from, text });
    console.log('Message sent:');
  } catch (err) {
    console.error('Error:');
  }
}

sendSMS();

app.get("webhooks/delivery-receipt",(req,res,next)=>{
  console.log("jj");
})







app.use(cors())
app.options("*",cors())
dotenv.config({path:"config.env"})
app.use(compression());
app.use(express.static(path.join(__dirname,"uploads")))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


  server.listen(process.env.PORT,(req,res)=>{
    

    console.log(`app listen on port ${process.env.PORT}`,process.env.NODE_ENV);


})  

dbConnection();




mountRoute(app)




app.use("*",(req,res,next)=>{
    next(new appError(`cant find this url ${req.originalUrl}`,400))
})


app.use(globelError)





