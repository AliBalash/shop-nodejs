const express = require('express');
const { registerUser, loginUser, getAllUsers, getOneUser, deleteUser, updateUser, handelRefreshToken, logout } = require('../controller/userController');
const auchCheck = require('../middlewares/authCheck');
const router = express.Router();

//  Register
router.post("/register", registerUser)
//  Login
router.post("/login", loginUser)
//  All Users
router.get("/all", auchCheck, getAllUsers)
//  Refresh Token
router.get("/refresh", handelRefreshToken)
//  One User
router.get("/:id", auchCheck, getOneUser)
//  Delete User
router.delete("/:id", auchCheck, deleteUser)
//  Update User
router.put("/:id", auchCheck, updateUser)
//  Logout User
router.post("/logout", logout)





module.exports = router;