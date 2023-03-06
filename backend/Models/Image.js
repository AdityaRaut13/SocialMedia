/** @format */

const mongoose = require("mongoose");

let image = mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  file: {
    type: Buffer,
    required: true,
  },
});

module.exports = mongoose.model("image", image);
