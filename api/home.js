const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Food = require('../Schemas/foodSchema.js');
const { isLoggedIn } = require("../middleware/auth.js");

router.post('/',isLoggedIn,async(req,res)=>{
    try{
    const {title,description,price} = req.body;
    const user = await User.findOne({email:req.user.email});
    const newFood = new Food({title,description,price,userId:user._id}).save();
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

router.get("/", async (req, res) => {   // query params 
    let food = [];
    const query = req.query.search||"";
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 2;
    food = await Food.find({title:{$regex:query,$options:"i"}}).sort({createAt:-1})
    return res.status(200).json(food);
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

  module.exports = async (req, res) => {
    await router(req, res);
};