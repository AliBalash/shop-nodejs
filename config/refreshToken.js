const jwt = require('jsonwebtoken');

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '2h' });
}

module.exports = generateRefreshToken