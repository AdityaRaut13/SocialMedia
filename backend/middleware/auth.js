/** @format */

const handleAsync = require("async-error-handler");
const errorHandler = require("./error");
const jwt = require("jsonwebtoken");
const Users = require("../Models/User");

const auth = handleAsync(async (req, res, next) => {
  let authHeader = req.header("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401);
    throw new Error("Not Authorized");
  }
  let token = authHeader.split(" ")[1];
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Users.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401);
    throw err;
  }
}, errorHandler);

module.exports = {
  auth,
};
