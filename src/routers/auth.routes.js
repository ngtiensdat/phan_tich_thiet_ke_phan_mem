const express = require("express");
const router = express.Router();
const { signUp, signIn, signOut } = require("../auth/auth");

// Thêm route GET cho sign-in
router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in");
});

router.post("/sign-in", signIn);

// Thêm route GET cho sign-up nếu cần
router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up");
});

router.post("/sign-up", signUp);
router.get("/sign-out", signOut);

module.exports = router;