const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("registration", { title: "Đăng ký học phần" });
});

module.exports = router;
