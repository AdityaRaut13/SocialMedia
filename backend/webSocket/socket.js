/** @format */

const { createServer } = require("http");
const { Server } = require("socket.io");
const Messages = require("../Models/Message");
const authWebSocket = require("./middleware");
const jwt = require("jsonwebtoken");

const CurrentUserMap = new Map();

const WebSocketServer = (app) => {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: true,
  });
  io.use(authWebSocket);
  io.on("connection", (socket) => {
    CurrentUserMap.set(socket.user._id.toString(), socket);
    const auth = (authHeader) => {
      let token = authHeader.split(" ")[1];
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        return true;
      } catch (err) {
        CurrentUserMap.delete(socket.user._id.toString());
        return false;
      }
    };
    socket.on("message", async (newMsg) => {
      if (!auth(socket.handshake.auth.token)) {
        socket.emit("error", { msg: "token expired" });
        socket.disconnect(true);
        return;
      }
      if (newMsg.me !== socket.user._id.toString()) {
        socket.emit("error", { msg: "bad request" });
        return;
      }
      try {
        const saveMsg = new Messages({
          sender: newMsg.me,
          receiver: newMsg.user,
          message: newMsg.msg,
        });
        await saveMsg.save();
        let serverMsg = await Messages.aggregate([
          { $match: { _id: saveMsg._id } },
          { $limit: 1 },
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
              localField: "receiver",
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
              as: "receiver",
            },
          },
          {
            $unwind: "$sender",
          },
          {
            $unwind: "$receiver",
          },
          {
            $project: {
              sender: "$sender",
              receiver: "$receiver",
              t: "$createdAt",
              msg: "$message",
            },
          },
        ]);
        console.log(serverMsg);
        serverMsg = serverMsg[0];

        socket.emit("message", serverMsg);
        const otherUserSocket = CurrentUserMap.get(newMsg.user);
        if (!otherUserSocket) {
          console.log("Other user not present!");
          return;
        }
        otherUserSocket.emit("message", serverMsg);
      } catch (err) {
        console.log(err);
        socket.emit("error", err);
      }
    });
    socket.on("disconnect", () => {
      CurrentUserMap.delete(socket.user._id.toString());
    });
  });
  return httpServer;
};

module.exports = WebSocketServer;
