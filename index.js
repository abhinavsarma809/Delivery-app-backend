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
    origin: "*"
}));
app.use(express.json());
app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`);
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));
})


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api/user", userRoutes);
app.use("/api/food", foodRoutes);

