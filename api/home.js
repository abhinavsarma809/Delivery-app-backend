const express=require('express');
const router = express.Router();
const User = require('../Schemas/userSchema.js');
const Food = require('../Schemas/foodSchema.js');
const { isLoggedIn } = require("../middleware/auth");

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

router.post('/:id',async(req,res)=>{
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
router.get("/:id",async(req,res)=>{
    try{
        const food = await Food.findOne(req.params.id);
        if(!food){
            res.status(400).json({message:"food data not found"});
            return
        }
        return res.status(200).json(food);
    }
    catch(error){
        res.status(500).json({message:"server errro"});
    }
})

module.exports=router;