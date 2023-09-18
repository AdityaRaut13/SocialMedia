/** @format */

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config({ path: ".env" });
const morgan = require("morgan");
const cors = require("cors");

require("./backend/config/db")(); // initialise database
//require("./backend/config/initial")(50); // make some random users.

const PORT = process.env.PORT || 5000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: true,
});
// server side/
io.use(async (socket, next) => {
  const authHeader = socket.handshake.auth.token;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next(new Error("Not Authorized"));
  }
  let token = authHeader.split(" ")[1];
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Users.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    next(err);
  }
});
io.on("connection", (socket) => {
  // i need to handle the socket._id to user.id
  // sending the messages from the user:
  // i need the sender's id with reciever's id with the msg itself
  // i need to map it to the socket._id for the reciever if it exists.
  // i need to send that to the reciever and also update the messages table.
  // i need to also check if the user's token is expired on it
  socket.send("hello world");
  socket.on("message", (message, number) => {
    console.log(message);
    console.log(number);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(morgan("combined"));

app.use("/images", express.static(process.env.FILE_STORAGE));

app.use("/api/user", require("./backend/Routes/userRoutes"));
app.use("/api/tech", require("./backend/Routes/techRoutes"));

httpServer.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
