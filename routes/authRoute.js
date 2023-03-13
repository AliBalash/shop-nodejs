const express = require('express');
const { registerUser, loginUser, getAllUsers, getOneUser, deleteUser, updateUser, handelRefreshToken, logout, updatePassword, forgotPassword } = require('../controller/userController');
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
//  Updated Password User
router.put("/password/:id", auchCheck , updatePassword)

//  Forgot Password User
router.post("/forgot-password", forgotPassword)



module.exports = router;