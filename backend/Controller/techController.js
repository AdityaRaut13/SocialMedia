/** @format */

const tech = require("../Models/Technology");
const errorHandler = require("../middleware/error");
const handleAsync = require("async-error-handler");

/**
 * @format
 * @path : /api/tech/
 * @method : GET
 * @DESC : Returns the tech available
 */
const getTech = handleAsync(async (req, res) => {
  let result = await tech.find({});
  res.json(result);
}, errorHandler);

module.exports = { getTech };
