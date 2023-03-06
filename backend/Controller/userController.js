/** @format */

const Users = require("../Models/User");
const handleAsync = require("async-error-handler");
const errorHandler = require("../middleware/error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Image = require("../Models/Image");

/**
 * @DESC :  Get users which are similar to current user.
 * @METHOD : GET
 * @PATH : /api/user/
 * @DONE : True
 * @PRIVATE : True
 */
const getUser = handleAsync(async (req, res) => {
  let userTech = [...req.user.workedOn, ...req.user.interested];
  let user = await Users.find({})
    .or([{ workedOn: { $in: userTech } }, { interested: { $in: userTech } }])
    .populate("workedOn interested")
    .select("-password");
  res.json(user);
}, errorHandler);

/**
 * @DESC : create the user. Returns a JWT token.
 * @METHOD  : POST
 * @PATH : /api/user/
 * @DONE : True
 * @PRIVATE : False
 */
const createUser = handleAsync(async (req, res) => {
  let { email, password, username } = req.body;
  if (!password || !username) {
    res.status(400);
    throw new Error("Bad request");
  }
  let userFound =
    (await Users.findOne({ email })) || (await Users.findOne({ username }));

  if (userFound) {
    res.status(400);
    throw new Error("User Already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  let user = await Users.create({
    email,
    username,
    password: hashedPassword,
  });
  if (user) {
    let token = generateToken(user.id);
    res.status(201).json({
      email: user.email,
      id: user.id,
      username: user.username,
      token,
    });
    return;
  }
  res.status(400);
  throw new Error("Bad Request");
}, errorHandler);

/**
 * @DESC : login using email and password . Returns a JWT token.
 * @METHOD : POST
 * @PATH : /api/user/login
 * @DONE : True
 * @PRIVATE : False
 */
const loginUser = handleAsync(async (req, res) => {
  let { email, password } = req.body;
  if (!password) {
    res.status(400);
    throw new Error("Bad Request");
  }
  let userFound = await Users.findOne({ email });
  if (!userFound) {
    res.status(400);
    throw new Error("Wrong Email");
  }
  let verdict = await bcrypt.compare(password, userFound.password);
  if (!verdict) {
    res.status(400);
    throw new Error("Wrong Password");
  }
  let token = generateToken(userFound.id);
  res.json({
    username: userFound.username,
    email,
    token,
  });
}, errorHandler);

/**
 * @DESC : update workedon,interests of user
 * @METHOD : PUT
 * @PATH : /api/user/
 * @DONE : True
 * @PRIVATE : True
 */
const updateUser = handleAsync(async (req, res) => {
  try {
    let { workedOn, interested, projects } = req.body;
    req.user.workedOn = workedOn;
    req.user.interested = interested;
    req.user.projects = projects;
    await req.user.save();
    res.json({ status: "Successfully updated" });
  } catch (err) {
    res.status(500);
    throw err;
  }
}, errorHandler);

/**
 * @DESC : delete the user from database.
 * @METHOD : DELETE
 * @PATH : /api/user/
 * @DONE : False
 */
const deleteUser = handleAsync(async (req, res) => {
  await Users.findByIdAndDelete(req.user.id);
  res.json({ status: "successfull" });
}, errorHandler);

/**
 * @DESC : Upload the profile pic
 * @METHOD : POST - form-data
 * @PATH : /api/user/upload
 * @Done : True
 * @REMAINING : magic number check must be performed.
 */
const uploadPic = handleAsync(async (req, res) => {
  // the content is in req.file.buffer and the meta data in req.file.mimetype
  // validation must be done on the file.mimetype and the content.
  // First the file must be created and then must be added to the user i.e. req.user obj
  if (req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/png") {
    res.status(400);
    throw new Error("Bad Request");
  }
  try {
    let image = new Image({
      filename: `avatar.${req.file.mimetype.substr(
        req.file.mimetype.lastIndexOf("/") + 1
      )}`,
      file: req.file.buffer,
    });
    req.user.profilePic = image;
    await req.user.save();
    res.json({
      status: "update successfully",
    });
  } catch (err) {
    res.status(500);
    throw err;
  }
}, errorHandler);

/**
 * @DESC : Returns the current user profile
 * @METHOD : GET
 * @PATH : /api/user/me
 * @DONE : True
 * @PRIVATE : True
 */
const getUserProfile = handleAsync(async (req, res) => {
  res.json(await req.user.populate("workedOn interested"));
}, errorHandler);

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  uploadPic,
  getUserProfile,
};

let generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
