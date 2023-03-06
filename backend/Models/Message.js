/** @format */

const mongoose = require("mongoose");
let message = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    reciever: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);
message.index({ createdAt: 1 });
message.index({ updatedAt: 1 });
module.exports = mongoose.model("message", message);
