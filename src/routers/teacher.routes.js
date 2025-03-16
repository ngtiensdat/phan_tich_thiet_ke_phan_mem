const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureTeacher } = require("../middleware/auth.middleware");
const teacherController = require("../app/controller/teacher.controller");
const multer = require("multer");
const path = require("path");
const knex = require("../config/database");

// Cấu hình multer để upload ảnh đại diện
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/avatars/');
    },
    filename: function (req, file, cb) {
        cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Chỉ cho phép tải lên các file hình ảnh!');
        }
    }
});

router.use(ensureAuthenticated);
router.use(ensureTeacher);

router.get("/homepage", (req, res) => {
    res.render("teacher/homepage", { user: req.session.user });
});

router.get("/profile", teacherController.getProfile);

router.post("/profile/update", upload.single('avatar'), teacherController.updateProfile);

router.get("/schedule", (req, res) => {
    res.render("teacher/schedule", { user: req.session.user });
});

router.get("/schedule-data", async (req, res) => {
    try {
        const { day, month, year } = req.query;
        const maGV = req.session.user.maGV;

        if (!req.session || !req.session.user || !req.session.user.maGV) {
            return res.status(401).json({ error: "Unauthorized: No user session" });
        }

        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        const weekday = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][dayOfWeek];
        const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const scheduleItems = await knex('lichhoc_tinchi as lh')
            .join('tinchi as tc', 'lh.maTinChi', 'tc.maTinChi')
            .select(
                'tc.maTinChi',
                'tc.tenTinChi',
                'lh.tietBD',
                'lh.tietKT',
                'lh.phong',
                'lh.thu',
                'lh.ngay'
            )
            .where('lh.maGV', maGV)
            .where(function () {
                this.where('lh.ngay', formattedDate)
                    .orWhere('lh.thu', weekday);
            });

        for (let item of scheduleItems) {
            const students = await knex('sinhvien_tinchi as svtc')
                .join('sinhvien as sv', 'svtc.maSV', 'sv.maSV')
                .select(
                    'sv.maSV',
                    knex.raw('CONCAT(sv.hoDem, " ", sv.ten) as tenSV')
                )
                .where('svtc.maTinChi', item.maTinChi);
            item.students = students;
        }

        res.json(scheduleItems);
    } catch (error) {
        console.error('Error fetching teacher schedule:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy lịch dạy' });
    }
});

router.get("/class-student", teacherController.getClassStudents);

module.exports = router;