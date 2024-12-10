const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../Schemas/userSchema.js'); 

const Food = require('../Schemas/foodSchema.js');
const { isLoggedIn } = require("../middleware/auth.js");

router.post('/',isLoggedIn,async(req,res)=>{
    try{
    const {title,description,price} = req.body;
    const user = await User.findOne({email:req.user.email});
    const newFood = await new Food({title,description,price,userId:user._id}).save();
    return res.status(200).json({message:"food menu created successfully",id:newFood._id});
    }
    catch (error){
        console.log(error);
        res.status(500).json({ message: "Server error" });

    }

});

router.put('/:id',async(req,res)=>{
    try{
        const {title,description,price} = req.body;
        const user = await User.findOne({email:req.user.email});
        const food = await Food.findOne({_id:req.params.id,userId:user._id});
        if(!food){
            res.status(400).json({message:"food data not found"});

        }
        food.title= title;
        food.description = description;
        food.price = price;
        await food.save();
        return res.status(200).json({message:"food data edited "})

    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/", async (req, res) => {
  try {
      console.log("Query Params:", req.query);
      const food = await Food.find({ title: { $regex: req.query.search || "", $options: "i" } }).sort({ createdAt: -1 });
      console.log("Food Data:", food);
      res.status(200).json(food);
  } catch (error) {
      console.error("GET / Error:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid food ID" });
      }
  
  
      const food = await Food.findById(id); 
      if (!food) {
        return res.status(404).json({ message: "Food data not found" });
      }
  
      return res.status(200).json(food);
    } catch (error) {
      console.error("Server error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  });
  

  module.exports = router;
