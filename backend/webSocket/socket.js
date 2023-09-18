const { createServer } = require("http");
const { Server } = require("socket.io");
const Messages = require("../Models/Message");
const authWebSocket = require("./middleware");

const CurrentUserMap = new Map();

const WebSocketServer = (app) => {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: true,
  });
  io.use(authWebSocket);
  io.on("connection", (socket) => {
    const sendMessages = async () => {
      const messageSend = await Messages.aggregate([
        {
          $match: {
            $or: [{ sender: socket.user._id }, { reciever: socket.user._id }],
          },
        },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: { sender: "$sender", reciever: "$reciever" },
            recentMessage: { $first: "$message" },
            createdAt: { $first: "$createdAt" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id.sender",
            foreignField: "_id",
            as: "sender",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id.reciever",
            foreignField: "_id",
            as: "reciever",
          },
        },
      ]);
      socket.send(messageSend);
    };
    sendMessages();
    CurrentUserMap[socket.user.id] = socket;
    socket.on("message", (message, number) => {
      // i need the sender's id with reciever's id with the msg itself
      // i need to map it to the socket._id for the reciever if it exists.
      // i need to send that to the reciever and also update the messages table.
      // i need to also check if the user's token is expired on it
      console.log(message);
      console.log(number);
    });
  });
  return httpServer;
};

module.exports = WebSocketServer;
