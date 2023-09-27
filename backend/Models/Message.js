/** @format */

const mongoose = require("mongoose");
const User = require("./User");
const userValidation = async (_id) => {
  const user = await User.findById(_id);
  return !!user;
};
let message = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
      validate: {
        validator: userValidation,
        message: "Invalid User",
      },
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
      validate: {
        validator: userValidation,
        message: "Invalid User",
      },
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);
message.index({ createdAt: -1 });
message.index({ updatedAt: -1 });
message.index({ sender: 1 });
message.index({ receiver: 1 });
module.exports = mongoose.model("message", message);
