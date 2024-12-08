const mongoose = require("mongoose");
const express = require("express");
const app = express();
const env = require("dotenv");
const cors = require("cors");

env.config();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;
const userRoutes = require('./api/user');
const foodRoutes = require('./api/home');

app.use(cors({
    origin: "*"
}));

app.use(express.json());

app.listen(PORT,()=>{
    console.log(`server is running in${PORT}`);
    mongoose.connect(MONGO_URL).then(()=>console.log("connected to mongoose")).catch((err)=> console.log(err));
});

app.get("/", (req, res) => {
    res.send("Hello World");
});


app.use("/api/user", userRoutes);
app.use("/api/food", foodRoutes);


