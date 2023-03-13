const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const auchCheck = asyncHandler(async (req, res, next) => {

    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req?.headers?.authorization?.split(' ')[1];
        try {
            if (token) {
                const decode = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decode.userId)
                if (!user) {
                    throw new Error("Not Authorized token Valid , User Not Found")
                }
                req.user = user;
                next();
            }
        } catch {
            throw new Error("Not Authorized token expired , please login again")
        }
    } else {
        throw new Error("there is no token atached to header")
    }
})

module.exports = auchCheck