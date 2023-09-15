/** @format */

const Users = require("../Models/User");
const handleAsync = require("async-error-handler");
const errorHandler = require("../middleware/error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    let { bio, workedOn, interested, projects } = req.body;
    req.user.workedOn = workedOn;
    req.user.interested = interested;
    req.user.projects = projects;
    req.user.bio = bio;
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
  // generate a link for the same.
  // save the reference in the req.user database and the return.
  let link = `http://localhost:${process.env.PORT}/images/${req.file.filename}`;
  req.user.profileLink = link;
  await req.user.save();
  res.status(200).json({ status: "Changed Successfully" });
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

/**
 * @DESC : Returns the other user profile
 * @METHOD : GET
 * @PATH : /api/user/:username
 * @PRIVATE : False
 */
const getOtherUser = handleAsync(async (req, res) => {
  const { username } = req.params;
  const current = await Users.findOne({ username })
    .populate("workedOn interested")
    .select("-password");
  if (!current) {
    res.status(400);
    throw new Error("Wrong Username");
  }
  res.status(200).json(current);
}, errorHandler);

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  uploadPic,
  getUserProfile,
  getOtherUser,
};

let generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
