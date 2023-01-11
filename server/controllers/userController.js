const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

/*Configuration for Signup */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  /* Validating the login credentials are provided */
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please enter all the fields');
  }

  /* Checking if the user already exists */
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).send('User already exists');
    //throw new Error('User already exists');
  }

  /* IF user doesn't exist creating new user with the User schema */
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  /* Validating if the user is created (201)-> success (400)->error*/
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send('Failed to create new user');
    //throw new Error('Failed to create new user');
  }
});

/* Configuration for login */

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).send('Invalid Email or Password');
  }
});

/* Fetch all users */
const allUsers = asyncHandler(async (req, res) => {
  const keyWord = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};
  //console.log(req.user);
  const users = await User.find(keyWord).find({ _id: { $ne: req.user._id } }); //.find({ _id: { $ne: req.user._id } }); -> used to avoid the current user in search
  res.status(200).send(users);
});

module.exports = { registerUser, authUser, allUsers };
