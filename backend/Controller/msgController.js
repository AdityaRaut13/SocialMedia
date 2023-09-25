/** @format */

const Messages = require("../Models/Message");
const User = require("../Models/User");
const handleAsync = require("async-error-handler");
const errorHandler = require("../middleware/error");

/**
 * @DESC :  Get the recent messages and from whom.
 * @METHOD : GET
 * @PATH : /api/messages/recentMessages
 * @DONE : True
 * @PRIVATE : True
 */
const getRecentMessages = handleAsync(async (req, res) => {
  const messageSend = await Messages.aggregate([
    {
      $match: {
        $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: { sender: "$sender", receiver: "$receiver" },
        recentMessage: { $first: "$message" },
        t: { $first: "$createdAt" },
      },
    },
    { $sort: { t: -1 } },
    {
      $project: {
        sender: "$_id.sender",
        receiver: "$_id.receiver",
        _id: 0,
        msg: "$recentMessage",
        t: { $toDate: "$t" },
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
        sender: {
          $cond: {
            if: { $eq: ["$sender._id", req.user._id] },
            then: "$$REMOVE",
            else: "$sender",
          },
        },
        receiver: {
          $cond: {
            if: { $eq: ["$receiver._id", req.user._id] },
            then: "$$REMOVE",
            else: "$receiver",
          },
        },
        msg: 1,
        t: 1,
      },
    },
  ]);
  const msgMap = new Map();
  const result = [];
  for (let msg of messageSend) {
    if (msg.sender === undefined && msg.receiver === undefined) {
      result.push(msg);
      continue;
    }
    const person = msg.sender ?? msg.receiver;
    const mapMsg = msgMap.get(person._id.toString());
    if (mapMsg) {
      const msgPushed = mapMsg.t >= msg.t ? mapMsg : msg;
      result.push(msgPushed);
      continue;
    }
    msgMap.set(person._id.toString(), msg);
  }
  res.send(result);
}, errorHandler);

/**
 * @DESC :  Get the messages between current user and the username provided.
 * @METHOD : GET
 * @PATH : /api/messages/:username
 * @DONE : True
 * @PRIVATE : True
 */
const getUserMessage = handleAsync(async (req, res) => {
  const { username } = req.params;
  const otherUser = await User.findOne({ username }).select(
    "-password -email -bio -workedOn -interested"
  );
  if (!otherUser) {
    res.status(400);
    throw new Error("Wrong username");
  }
  const messageSend = await Messages.aggregate([
    {
      $sort: { createdAt: -1 },
    },
    {
      $match: {
        $or: [
          {
            $and: [{ sender: otherUser._id }, { receiver: req.user._id }],
          },
          {
            $and: [{ sender: req.user._id }, { receiver: otherUser._id }],
          },
        ],
      },
    },
    {
      $project: {
        sender: "$sender",
        receiver: "$receiver",
        t: { $toDate: "$createdAt" },
        msg: "$message",
        _id: 0,
      },
    },
    { $sort: { t: 1 } },
  ]);
  res.status(200).send({ messageSend, user: otherUser, me: req.user });
}, errorHandler);
module.exports = {
  getRecentMessages,
  getUserMessage,
};
