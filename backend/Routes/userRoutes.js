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
} = require("../Controller/userController");
const { auth } = require("../middleware/auth");
const multer = require("multer");
let upload = multer({ storage: multer.memoryStorage() });

router
  .route("/")
  .get(auth, getUser)
  .post(createUser)
  .put(auth, updateUser)
  .delete(auth, deleteUser);
// need to remove the id in this column.
router.post("/login", loginUser);
router.route("/upload").post(auth, upload.single("avatar"), uploadPic);
router.get("/me", auth, getUserProfile);

module.exports = router;
