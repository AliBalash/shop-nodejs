const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/jwtToken');
const validateMongoId = require('../utils/validateMongoID');
const generateRefreshToken = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailController ');

//  register user
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, mobile, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
        //  Create User
        const newUser = await User.create({
            name,
            email,
            mobile,
            password,
        })
        res.json(newUser)
    } else {
        //  User Already Exists
        console.log(findUser)
        throw new Error("User Already Exists")
    }
})

//  login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    //  check if user exists or not
    const userFind = await User.findOne({ email })
    if (userFind && await userFind.comparePassword(password)) {
        const refreshToken = generateRefreshToken(userFind?.id);
        const userUpdate = await User.findByIdAndUpdate(userFind?.id, {
            refreshToken: refreshToken
        }, {
            new: true
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 //one day
        })
        res.json({
            user: userFind,
            token: generateToken(userFind?._id)
        })
    } else {
        throw new Error("Email or Password Is Not Valid")
    }
})


//  get all users
const getAllUsers = asyncHandler(async function (req, res) {
    try {
        const users = await User.find();
        res.status(200).json(users)
    } catch (error) {
        throw new Error(error)
    }
})


//  get one user
const getOneUser = asyncHandler(async function (req, res) {

    validateMongoId(req.params.id)
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user)

    } catch {
        throw new Error('This User Not Found')
    }
})

//  delete user
const deleteUser = asyncHandler(async function (req, res) {
    validateMongoId(req.params.id)

    try {

        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedUser)
    } catch {
        throw new Error('This User Not Found')
    }
})

//  update user
const updateUser = asyncHandler(async function (req, res) {
    validateMongoId(req.params.id)

    try {

        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            name: req?.body?.name,
            email: req?.body?.email,
            role: req?.body?.role,
            mobile: req?.body?.mobile,
        }, {
            new: true
        });
        res.status(200).json(updateUser)
    } catch {
        throw new Error('This User Not Found')
    }
})

//  refresh token updated
const handelRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No Refresh Token in cookie');
    const refreshToken = cookie.refreshToken;

    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error('This Token is not matched for user. please login again')

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.userId) {
            throw new Error('there is somethings wrong')
        } else {
            const accessToken = generateToken(user?.id);
            res.json({
                token: accessToken
            }
            )
        }
    })
})

//  logout
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie?.refreshToken) throw new Error('No Reresh Token in cookie');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204) //forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: null
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    res.sendStatus(204) //forbidden
})

//  update password user
const updatePassword = asyncHandler(async (req, res) => {

    const id = req.params.id;
    const password = req.body.password;

    const user = await User.findById(id);
    if (!user) {
        throw new Error('this user not found');
    }

    if (password) {
        user.password = password;
        const updateUserPassword = await user.save();
        res.json(updateUserPassword);
    } else {
        throw new Error('password is incorrect for updated');
    }
})

//  forgot password user
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('user not found with this email');
    }

    try {
        const resetURL = `Hi , please reset your password . <a href='http://127.0.0.1:2020/api/user/reset-password/${user.id}'>Click Here</a>`

        const data = {
            to: email,
            Text: "hey user",
            subject: "Forgot password Link",
            html: resetURL
        }
        sendEmail(data)

        res.json(user)

    } catch (error) {

    }

})


module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getOneUser,
    deleteUser,
    updateUser,
    handelRefreshToken,
    logout,
    updatePassword,
    forgotPassword,
}
