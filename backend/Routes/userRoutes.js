/** @format */

const express = require("express");
const router = express.Router();
const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  uploadPic,
  getUserProfile,
  getOtherUser,
} = require("../Controller/userController");
const { auth } = require("../middleware/auth");
const errorHandler = require("../middleware/error");
const upload = require("../middleware/uploadFile");

router
  .route("/")
  .get(auth, getUser)
  .post(createUser)
  .put(auth, updateUser)
  .delete(auth, deleteUser);
router.post("/login", loginUser);
router.post("/upload", auth, upload.single("avatar"), uploadPic);
router.get("/me", auth, getUserProfile);
router.get("/:username", getOtherUser);
router.use(errorHandler);

module.exports = router;
