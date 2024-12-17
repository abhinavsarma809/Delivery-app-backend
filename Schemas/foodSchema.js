const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true, // Add an index for title to improve search speed
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number, // Change to Number for better numeric operations
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Food', FoodSchema);
