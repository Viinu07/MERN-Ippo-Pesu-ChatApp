const jwt = require('jsonwebtoken');

/* Using JWT webtoken for authorization */
//JWT_SECRET is added in .env file to have secret id
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
