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
          $project: {
            sender: "$_id.sender",
            reciever: "$_id.reciever",
            _id: 0,
            msg: "$recentMessage",
            t: { $toDate: "$createdAt" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "sender",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  password: 0,
                  bio: 0,
                  projects: 0,
                  interested: 0,
                  workedOn: 0,
                  __v: 0,
                },
              },
            ],
            as: "sender",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "reciever",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  password: 0,
                  bio: 0,
                  projects: 0,
                  interested: 0,
                  workedOn: 0,
                  __v: 0,
                },
              },
            ],
            as: "reciever",
          },
        },
        {
          $unwind: "$sender",
        },
        {
          $unwind: "$reciever",
        },
        {
          $project: {
            sender: {
              $cond: {
                if: { $eq: ["$sender._id", socket.user._id] },
                then: "$$REMOVE",
                else: "$sender",
              },
            },
            reciever: {
              $cond: {
                if: { $eq: ["$reciever._id", socket.user._id] },
                then: "$$REMOVE",
                else: "$reciever",
              },
            },
            msg: 1,
            t: 1,
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
