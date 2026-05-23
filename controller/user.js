const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");

const userCtrl = {
  //! register
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    //! validation
    if (!username || !email || !password) {
      throw new Error("please all feild are required");
    }

    //! check if user exist
    const userExits = await User.findOne({ email });
    if (userExits) {
      throw new Error("user already exist");
    }

    //! hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //! create the  user
    const userCreated = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    // send the response
    res.json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
    });
  }),

  //! login
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    //! Check if user email exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    //! check if user password is valid
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid Credentials");
    }

    //! if user email and password is valid then generate token

    const token = jwt.sign({ id: user._id }, "anykey", { expiresIn: "30d" });

    //! response
    res.json({
      message: "Login successs",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }),

  //! profile
  profile: asyncHandler(async (req, res) => {
    //find the user
    const user = await User.findById(req.user).select("-password");
    
    res.json({ user });
  }),
};

module.exports = userCtrl;
