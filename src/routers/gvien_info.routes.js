const express = require('express');
const router = express.Router();

router.get('/gvien-info', (req, res) => {
    const gvienInfo = {
        id: 'GV001',
        lastname: 'Nguyen',
        dob: '1990-05-15',
        firstname: 'Van A',
        department: 'CNTT',
        specialization: 'Machine Learning',
        email: 'nguyenvana@example.com',
        degree: 'Thạc sĩ',
        gender: 'Nam',
        role: 'Giảng viên',
        faculty: 'Khoa CNTT'
    };
    res.render('gvien_info', { gvienInfo });
});

module.exports = router;