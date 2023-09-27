/** @format */

const mongoose = require("mongoose");

let project = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: String,
});
module.exports = mongoose.model("project", project);
