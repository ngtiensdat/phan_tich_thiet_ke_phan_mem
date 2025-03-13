// src/routes/student_info.routes.js
const express = require('express');
const router = express.Router();

// Giả lập dữ liệu thông tin sinh viên (bạn có thể thay bằng dữ liệu từ database)
const studentData = {
    id: "123456",
    lastname: "Nguyen",
    firstname: "Van A",
    dob: "2000-01-01",
    course: "K45",
    class: "CNTT01",
    year: "2023-2027",
    faculty: "Công nghệ Thông tin",
    email: "user@example.com",
    major: "Kỹ thuật phần mềm",
    gender: "Nam",
    system: "Chính quy",
    status: "Đang học",
    role: "Sinh viên",
    program: "Cử nhân"
};

// Trang thông tin học sinh
router.get('/', (req, res) => {
    res.render('student_info', { studentInfo: studentData });
});

module.exports = router;