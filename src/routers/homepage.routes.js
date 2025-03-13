const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    const data = {
        userEmail: "user@example.com",
        courses: [
            {
                image: "math.jpg",
                name: "Toán cao cấp",
                description: "Giải quyết các bài toán phức tạp.",
                credits: 3,
                theme: "",
            },
            {
                image: "cs.jpg",
                name: "Lập trình C++",
                description: "Học lập trình hướng đối tượng.",
                credits: 4,
                theme: "",
            },
            {
                image: "ai.jpg",
                name: "Trí tuệ nhân tạo",
                description: '<span class="highlight">Khóa học đặc biệt</span>',
                credits: 5,
                theme: "dark-theme",
            },
        ],
        studentInfo: {
            id: "SV001",
            lastname: "Nguyen",
            dob: "2000-01-01",
            firstname: "An",
            course: "K62",
            class: "CNTT1",
            year: "2020-2024",
            faculty: "CNTT",
            email: "an.nguyen@example.com",
            major: "Công nghệ thông tin",
            gender: "Nam", // Ensure this is a valid string
            system: "Chính quy",
            status: "Hoạt động",
            role: "",
            program: "Đại học",
        },
    };
    res.render("homepage", data);
});

module.exports = router;