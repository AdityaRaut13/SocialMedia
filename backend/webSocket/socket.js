/** @format */

const { createServer } = require("http");
const { Server } = require("socket.io");
const Messages = require("../Models/Message");
const authWebSocket = require("./middleware");
const User = require("../Models/User");

const CurrentUserMap = new Map();

const WebSocketServer = (app) => {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: true,
  });
  io.use(authWebSocket);
  io.on("connection", (socket) => {
    socket.on("specificUserMsg", async (_id, cb) => {
      if (!_id) {
        return;
      }
      const otherUser = await User.findOne({ _id }).select(
        "-password -email -bio -workedOn -interested"
      );
      const messageSend = await Messages.aggregate([
        {
          $sort: { createdAt: -1 },
        },
        {
          $match: {
            $or: [
              {
                $and: [
                  { sender: otherUser._id },
                  { receiver: socket.user._id },
                ],
              },
              {
                $and: [
                  { sender: socket.user._id },
                  { receiver: otherUser._id },
                ],
              },
            ],
          },
        },
        {
          $project: {
            sender: "$sender",
            receiver: "$receiver",
            t: "$createdAt",
            msg: "$message",
            _id: 0,
          },
        },
      ]);

      cb({ messageSend, user: otherUser });
    });
    CurrentUserMap[socket.user._id.toString()] = socket;
    socket.on("message", (message, number) => {
      // i need the sender's id with receiver's id with the msg itself
      // i need to map it to the socket._id for the receiver if it exists.
      // i need to send that to the receiver and also update the messages table.
      // i need to also check if the user's token is expired on it
      console.log(message);
      console.log(number);
    });
  });
  return httpServer;
};

module.exports = WebSocketServer;
