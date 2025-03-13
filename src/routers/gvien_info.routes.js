const express = require('express');
const router = express.Router();

// Mảng chứa danh sách giảng viên mẫu
router.get('/', (req, res) => {
    const gvien_list = [
        {
            id: 1,
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            specialization: 'Khoa học Máy tính'
        }
    ];
    res.render("gvien_info", { gvien_list });
});



module.exports = router;