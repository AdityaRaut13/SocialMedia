const jwt = require("jsonwebtoken");
const Users = require("../Models/User");

const authWebSocket = async (socket, next) => {
  // adding authentication middleware
  const authHeader = socket.handshake.auth.token;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next(new Error("Not Authorized"));
  }
  let token = authHeader.split(" ")[1];
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = await Users.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    next(err);
  }
};
module.exports = authWebSocket;
