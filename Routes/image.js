const express=require('express');
const router = express.Router();
const multer = require("multer");
const Image = require("../Schemas/imageSchema.js");
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, 
});


router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: "No file uploaded" });
        }

        
        console.log("File received:", req.file); 
        const { originalname, mimetype, buffer } = req.file;

        const image = new Image({
            name: originalname,
            image: {
                data: buffer,
                contentType: mimetype,
            },
        });

        await image.save();
        res.status(201).send({ message: "Image uploaded successfully", id: image._id });
    } catch (error) {
        console.error("Error uploading image:", error); 
        res.status(500).send({ error: "Failed to upload image" });
    }
});



router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Image.findById(id);

        if (!image) {
            return res.status(404).send({ error: "Image not found" });
        }

        res.contentType(image.image.contentType);
        res.send(image.image.data);
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch image" });
    }
});
router.delete('/:id',async(req,res)=>{
    try{
        const {id}=req.params;
        const image = await Image.findOne({ _id: req.params.id});
        if (!image) {
            res.status(400).json({ message: "not found" });
            return
        }
        await Image.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "image deleted successfully" });
    }
      catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }


})

module.exports = router;