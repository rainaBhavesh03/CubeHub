const mongoose = require("mongoose");

// Schema for creating categorys

const Category = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
});


module.exports = mongoose.model("Category", Category);
