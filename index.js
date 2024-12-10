const mongoose = require("mongoose");
const express = require("express");
const app = express();
const env = require("dotenv");
const cors = require("cors");
const Port = process.env.Port||3000;
const userRoutes = require('./api/user');
const foodRoutes = require('./api/home');

env.config();

const MONGO_URL = process.env.MONGO_URL;


app.use(cors({
    origin: "*", // You can use your Vercel URL instead of "*" for more security.
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
  
app.use(express.json());
app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`);
    mongoose.connect(MONGO_URL).then(()=>console.log("connected to mongoose")).catch((err)=>console.log(err));
})


app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/test-env", (req, res) => {
    res.status(200).json({
        JWT_SECRET: process.env.JWT_SECRET ? "Loaded" : "Not Loaded",
        MONGO_URI: process.env.MONGO_URI ? "Loaded" : "Not Loaded",
    });
});

app.use("/api/user", userRoutes);
app.use("/api/food", foodRoutes);

