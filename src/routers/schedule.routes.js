// src/routers/schedule.routes.js
const express = require("express");
const router = express.Router();

// Route cho /schedule
router.get("/", (req, res) => {
    res.render("schedule"); // Render file schedule.hbs
});

module.exports = router;