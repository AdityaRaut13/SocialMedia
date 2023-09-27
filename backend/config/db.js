/** @format */

const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

function connect() {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.db_path);
  } catch (err) {
    console.log(`Not able to Connect to Database.\n.${err}`.cyan);
    process.exit(1);
  }
}
module.exports = connect;
