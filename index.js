const mongoose=require("mongoose");
const express = require("express");
const app = express();
const env = require("dotenv");
env.config();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;
const userRoutes = require('./api/user');
const foodRoutes = require('./api/home')


const cors = require("cors");
app.use(cors({
    origin: "*"
}));

app.listen(PORT,()=>{

    console.log(PORT);
    mongoose.connect(MONGO_URL).then(()=>console.log('connected to mongoose')).catch((err)=>console.log(err))
})

app.get("/",(req,res)=>{
    res.send("Hello World");
})
app.use(express.json());
app.use("/api/user",userRoutes);
app.use("/api/food",foodRoutes);


