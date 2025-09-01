const express = require("express");
const {
    registerUser,
    loginUser,
    getUserProfile,
} = require("../controllers/user");
const { auth } = require("../auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, getUserProfile);

module.exports = router;
