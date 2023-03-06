/** @format */

const express = require("express");
const router = express.Router();
const { getTech } = require("../Controller/techController");

router.get("/", getTech);

module.exports = router;
