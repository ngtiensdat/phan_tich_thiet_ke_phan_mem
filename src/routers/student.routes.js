const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureStudent } = require("../middleware/auth.middleware");
const enrollmentController = require("../app/controller/enrollment.controller");
const StudentController = require("../app/controller/student.controller");
const Student = require("../app/models/student");
const multer = require("multer");
const path = require("path");
const knex = require("../config/database");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/img/students'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'sv_' + req.session.user.maSV + '_' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Chỉ hỗ trợ file hình ảnh: jpeg, jpg, png, gif'));
    }
});

router.use(ensureAuthenticated);
router.use(ensureStudent);

router.get("/homepage", (req, res) => {
    res.render("student/homepage", { user: req.session.user });
});

router.get("/schedule", (req, res) => {
    res.render("student/schedule", { user: req.session.user });
});

router.get("/schedule-data", async (req, res) => {
    try {
        const { day, month, year } = req.query;
        const maSV = req.session.user.maSV;
        
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        const weekday = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][dayOfWeek];
        
        const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        const scheduleItems = await knex('sinhvien_tinchi as svtc')
            .join('tinchi as tc', 'svtc.maTinChi', 'tc.maTinChi')
            .join('lichhoc_tinchi as lh', 'tc.maTinChi', 'lh.maTinChi')
            .leftJoin('giangvien as gv', 'lh.maGV', 'gv.maGV')
            .select(
                'tc.tenTinChi',
                'lh.tietBD',
                'lh.tietKT',
                'lh.phong',
                'lh.thu',
                'lh.ngay',
                knex.raw('CONCAT(gv.hoDem, " ", gv.ten) as tenGV')
            )
            .where('svtc.maSV', maSV)
            .where(function() {
                this.where('lh.ngay', formattedDate)
                    .orWhere('lh.thu', weekday);
            });
            
        res.json(scheduleItems);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy lịch học' });
    }
});

router.get('/enrollment', enrollmentController.getStudentCourses);
router.post('/enrollment/register', enrollmentController.registerCourse);
router.post('/enrollment/drop/:maTinChi', enrollmentController.dropCourse);

router.get("/student_info", async (req, res) => {
    try {
        const studentInfo = await Student.getStudentWithDepartment(req.session.user.maSV);
        res.render("student/student_info", { user: req.session.user, studentInfo });
    } catch (error) {
        console.error("Error fetching student info:", error);
        res.status(500).send("Lỗi máy chủ");
    }
});

// Thêm upload.single('avatar') để xử lý file upload
router.post("/update-info", upload.single('avatar'), StudentController.updateStudentInfo);

module.exports = router;