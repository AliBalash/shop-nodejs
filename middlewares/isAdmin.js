const asyncHandler = require("express-async-handler");


const isAdmin = asyncHandler(async (req, res, next) => {
    const { role } = req.user;
    if (req.user) {
        if (role !== 'admin') {
            throw new Error('this page accessable only admin')
        }
        next()
    } else {
        throw new Error('Not Authorization , please login and set token')
    }
})
module.exports = isAdmin