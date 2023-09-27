const express = require("express");
const router = express.Router();
const {
  getRecentMessages,
  getUserMessage,
} = require("../Controller/msgController");
const { auth } = require("../middleware/auth");
const errorHandler = require("../middleware/error");

router.route("/recentMessages").get(auth, getRecentMessages);
router.get("/users/:username", auth, getUserMessage);
router.use(errorHandler);
module.exports = router;
