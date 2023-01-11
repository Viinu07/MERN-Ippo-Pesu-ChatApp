const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]; //Decoding the token with Bearer --token
      //console.log('Token', token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      //console.log(error);
      res.status(401).send('Not authorized, token failed');
      //throw new Error('Not authorized, token failed');
    }
  }
  if (!token) {
    res.status(401).send('Not authorized, no token provided');
    //throw new Error('Not authorized, no token provided');
  }
});

module.exports = { protect };
