const mongoose = require("mongoose");

// Schema for creating types

const Type = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
});

module.exports = mongoose.model("Type", Type);
