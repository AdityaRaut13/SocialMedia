/** @format */

const mongoose = require("mongoose");

const project = require("./Project");
const tech = require("./Technology");
const { isEmail } = require("validator");

const techValidation = async (array) => {
  for (let techid of array) {
    let ir = await tech.findById(techid);
    if (!ir) return false;
  }
  return true;
};

let user = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: (v) => /[A-Za-z_0-9]+/.test(v),
      message: "Invalid Username",
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => isEmail(v),
      message: "Email Validation Failed",
    },
  },
  password: {
    type: String,
    required: true,
  },
  bio: String,
  workedOn: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "tech",
    validate: {
      validator: techValidation,
      message: "Not found ID",
    },
  },
  interested: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "tech",
    validate: {
      validator: techValidation,
      message: "Not Found ID",
    },
  },
  projects: {
    type: [project.schema],
  },
  profileLink: {
    type: String,
  },
});
module.exports = mongoose.model("user", user);
