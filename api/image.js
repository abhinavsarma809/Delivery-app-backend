// Use 'require' instead of 'import' for CommonJS compatibility
const express = require('express');
const multer = require("multer");
const Image = require("../Schemas/imageSchema.js"); // Adjust path if needed
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },  // 10MB file size limit
});

const app = express();

// POST - Upload Image Route
app.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: "No file uploaded" });
        }

        console.log("File received:", req.file);  // Logs to console for debugging
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

// GET - Fetch Image by ID Route
app.get('/:id', async (req, res) => {
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

// DELETE - Delete Image by ID Route
app.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Image.findById(id);

        if (!image) {
            return res.status(400).json({ message: "Image not found" });
        }

        await Image.findByIdAndDelete(id);
        return res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Export the Express app as a handler for Vercel
module.exports = app;
