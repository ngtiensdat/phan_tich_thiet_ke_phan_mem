// C:\PT\phan_tich_thiet_ke_phan_mem\src\routers\admin.routes.js
const express = require("express");
const router = express.Router();
const courseController = require('../app/controller/course.controller');
const studentController = require('../app/controller/student.controller');
const teacherController = require('../app/controller/teacher.controller');
const { ensureAuthenticated, ensureAdmin } = require("../middleware/auth.middleware");
const knex = require('../config/database');
const bcrypt = require('bcrypt');

router.use(ensureAuthenticated); // Yêu cầu đăng nhập trước
router.use(ensureAdmin); // Chỉ Admin mới truy cập

// Dashboard
router.get("/dashboard", async (req, res) => {
    try {
        const totalCourses = await knex('tinchi').count('* as count').first();
        const totalStudents = await knex('sinhvien').count('* as count').first();
        const totalTeachers = await knex('giangvien').count('* as count').first();

        res.render("admin/dashboard", {
            user: req.session.user,
            totalCourses: totalCourses.count || 0,
            totalStudents: totalStudents.count || 0,
            totalTeachers: totalTeachers.count || 0
        });
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu cho dashboard:", error);
        res.status(500).send("Đã xảy ra lỗi khi tải trang dashboard.");
    }
});

// Quản lý môn học
router.get("/manage-courses", async (req, res) => {
    try {
        const courses = await knex('tinchi').select('*');
        const departments = await knex('khoa').select('maKhoa', 'tenKhoa');
        const teachers = await knex('giangvien').select('maGV', 'hoDem', 'ten');

        res.render("admin/manage-courses", {
            user: req.session.user,
            courses,
            departments,
            teachers
        });
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu cho quản lý môn học:", error);
        res.status(500).send("Đã xảy ra lỗi khi tải trang quản lý môn học.");
    }
});

router.get("/courses/:maTinChi", async (req, res) => {
    try {
        const maTinChi = req.params.maTinChi;
        console.log("Fetching course with maTinChi:", maTinChi);
        const course = await knex('tinchi').where('maTinChi', maTinChi).first();
        if (!course) {
            return res.status(404).json({ error: "Môn học không tồn tại." });
        }
        res.json(course);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin môn học:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi lấy thông tin môn học." });
    }
});

router.get("/courses/schedule/:maTinChi", async (req, res) => {
    try {
        const maTinChi = req.params.maTinChi;
        console.log("Fetching schedule for maTinChi:", maTinChi);
        const schedule = await knex('lichhoc_tinchi').where('maTinChi', maTinChi).first();
        res.json(schedule || {});
    } catch (error) {
        console.error("Lỗi khi lấy thông tin lịch học:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi lấy thông tin lịch học." });
    }
});

router.post("/courses/add", async (req, res) => {
    try {
        const { tenTinChi, soTinChi, maKhoa, maGV, moTa, phong, ngay, thu, tietBD, tietKT } = req.body;

        await knex.transaction(async (trx) => {
            const [maTinChi] = await trx('tinchi').insert({
                tenTinChi,
                soTinChi,
                maKhoa,
                maGV,
                moTa
            });

            await trx('lichhoc_tinchi').insert({
                maTinChi,
                maGV,
                ngay,
                thu,
                tietBD,
                tietKT,
                phong
            });
        });

        res.redirect("/admin/manage-courses");
    } catch (error) {
        console.error("Lỗi khi thêm môn học:", error);
        res.status(500).send("Đã xảy ra lỗi khi thêm môn học.");
    }
});

router.post("/courses/edit", async (req, res) => {
    try {
        const { maTinChi, tenTinChi, soTinChi, maKhoa, maGV, moTa, phong, ngay, thu, tietBD, tietKT } = req.body;

        await knex.transaction(async (trx) => {
            await trx('tinchi').where('maTinChi', maTinChi).update({
                tenTinChi,
                soTinChi,
                maKhoa,
                maGV,
                moTa
            });

            const existingSchedule = await trx('lichhoc_tinchi').where('maTinChi', maTinChi).first();
            if (existingSchedule) {
                await trx('lichhoc_tinchi').where('maTinChi', maTinChi).update({
                    maGV,
                    ngay,
                    thu,
                    tietBD,
                    tietKT,
                    phong
                });
            } else {
                await trx('lichhoc_tinchi').insert({
                    maTinChi,
                    maGV,
                    ngay,
                    thu,
                    tietBD,
                    tietKT,
                    phong
                });
            }
        });

        res.redirect("/admin/manage-courses");
    } catch (error) {
        console.error("Lỗi khi sửa môn học:", error);
        res.status(500).send("Đã xảy ra lỗi khi sửa môn học.");
    }
});

router.post("/courses/delete", async (req, res) => {
    try {
        const { maTinChi } = req.body;

        await knex.transaction(async (trx) => {
            await trx('lichhoc_tinchi').where('maTinChi', maTinChi).del();
            await trx('tinchi').where('maTinChi', maTinChi).del();
        });

        res.redirect("/admin/manage-courses");
    } catch (error) {
        console.error("Lỗi khi xóa môn học:", error);
        res.status(500).send("Đã xảy ra lỗi khi xóa môn học.");
    }
});

// Quản lý sinh viên
router.get('/manage-students', async (req, res) => {
    try {
        console.log("Session user in manage-students:", req.session.user); // Gỡ lỗi
        const students = await knex('sinhvien')
            .join('users', 'sinhvien.user_id', 'users.id')
            .select(
                'sinhvien.maSV',
                'sinhvien.hoDem',
                'sinhvien.ten',
                'sinhvien.ngaySinh',
                'sinhvien.khoaHoc',
                'sinhvien.lop',
                'sinhvien.nienKhoa',
                'sinhvien.maKhoa',
                'sinhvien.email',
                'sinhvien.nganh',
                'sinhvien.gioiTinh',
                'sinhvien.heDaoTao',
                'sinhvien.trangThai',
                'sinhvien.chuongTrinhDaoTao',
                'users.id as user_id',
                'users.email',
                'users.role'
            );

        const departments = await knex('khoa').select('maKhoa', 'tenKhoa');

        res.render("admin/manage-students", {
            user: req.session.user,
            students,
            departments
        });
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sinh viên:", error);
        res.status(500).send("Đã xảy ra lỗi khi tải trang quản lý sinh viên.");
    }
});

router.get("/students/:maSV", async (req, res) => {
    try {
        const maSV = req.params.maSV;
        console.log("Fetching student with maSV:", maSV);
        const student = await knex('sinhvien')
            .join('users', 'sinhvien.user_id', 'users.id')
            .select(
                'sinhvien.maSV',
                'sinhvien.hoDem',
                'sinhvien.ten',
                'sinhvien.ngaySinh',
                'sinhvien.khoaHoc',
                'sinhvien.lop',
                'sinhvien.nienKhoa',
                'sinhvien.maKhoa',
                'sinhvien.email',
                'sinhvien.nganh',
                'sinhvien.gioiTinh',
                'sinhvien.heDaoTao',
                'sinhvien.trangThai',
                'sinhvien.chuongTrinhDaoTao',
                'users.id as user_id',
                'users.email',
                'users.role'
            )
            .where('sinhvien.maSV', maSV)
            .first();

        if (!student) {
            console.log("Student not found for maSV:", maSV);
            return res.status(404).json({ error: "Sinh viên không tồn tại." });
        }

        console.log("Fetched student:", student);
        res.json(student);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin sinh viên:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi lấy thông tin sinh viên." });
    }
});

router.post("/students/add", async (req, res) => {
    try {
        const { email, password, hoDem, ten, maSV, ngaySinh, gioiTinh, lop, maKhoa, khoaHoc, nienKhoa, nganh, heDaoTao, trangThai, chuongTrinhDaoTao } = req.body;

        await knex.transaction(async (trx) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [userId] = await trx('users').insert({
                email,
                password: hashedPassword,
                role: 'student'
            });

            await trx('sinhvien').insert({
                maSV,
                user_id: userId,
                hoDem,
                ten,
                ngaySinh,
                khoaHoc,
                lop,
                nienKhoa,
                maKhoa,
                email,
                nganh,
                gioiTinh,
                heDaoTao,
                trangThai,
                chuongTrinhDaoTao
            });
        });

        res.redirect("/admin/manage-students");
    } catch (error) {
        console.error("Lỗi khi thêm sinh viên:", error);
        res.status(500).send("Đã xảy ra lỗi khi thêm sinh viên.");
    }
});

router.post("/students/edit", async (req, res) => {
    try {
        const { maSV, email, password, hoDem, ten, ngaySinh, gioiTinh, lop, maKhoa, khoaHoc, nienKhoa, nganh, heDaoTao, trangThai, chuongTrinhDaoTao } = req.body;

        await knex.transaction(async (trx) => {
            const student = await trx('sinhvien').where('maSV', maSV).first();
            const userId = student.user_id;

            const userUpdate = { email };
            if (password) {
                userUpdate.password = await bcrypt.hash(password, 10);
            }
            await trx('users').where('id', userId).update(userUpdate);

            await trx('sinhvien').where('maSV', maSV).update({
                hoDem,
                ten,
                ngaySinh,
                khoaHoc,
                lop,
                nienKhoa,
                maKhoa,
                email,
                nganh,
                gioiTinh,
                heDaoTao,
                trangThai,
                chuongTrinhDaoTao
            });
        });

        res.redirect("/admin/manage-students");
    } catch (error) {
        console.error("Lỗi khi sửa sinh viên:", error);
        res.status(500).send("Đã xảy ra lỗi khi sửa sinh viên.");
    }
});

router.post("/students/delete", async (req, res) => {
    try {
        const { maSV } = req.body;

        await knex.transaction(async (trx) => {
            const student = await trx('sinhvien').where('maSV', maSV).first();
            const userId = student.user_id;

            await trx('sinhvien').where('maSV', maSV).del();
            await trx('users').where('id', userId).del();
        });

        res.redirect("/admin/manage-students");
    } catch (error) {
        console.error("Lỗi khi xóa sinh viên:", error);
        res.status(500).send("Đã xảy ra lỗi khi xóa sinh viên.");
    }
});

router.post("/students/change-role/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        await knex('users').where('id', userId).update({ role });

        res.redirect("/admin/manage-students");
    } catch (error) {
        console.error("Lỗi khi thay đổi quyền:", error);
        res.status(500).send("Đã xảy ra lỗi khi thay đổi quyền.");
    }
});

// Quản lý giảng viên
router.get('/manage-teachers', async (req, res) => {
    try {
        console.log("Session user in manage-teachers:", req.session.user); // Gỡ lỗi
        const teachers = await knex('giangvien')
            .join('users', 'giangvien.user_id', 'users.id')
            .select(
                'giangvien.maGV',
                'giangvien.hoDem',
                'giangvien.ten',
                'giangvien.ngaySinh',
                'giangvien.maKhoa',
                'giangvien.email',
                'users.id as user_id',
                'users.email',
                'users.role'
            );

        const departments = await knex('khoa').select('maKhoa', 'tenKhoa');

        res.render("admin/manage-teachers", {
            user: req.session.user,
            teachers,
            departments
        });
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu giảng viên:", error);
        res.status(500).send("Đã xảy ra lỗi khi tải trang quản lý giảng viên.");
    }
});

router.get("/teachers/:maGV", async (req, res) => {
    try {
        const maGV = req.params.maGV;
        console.log("Fetching teacher with maGV:", maGV);
        const teacher = await knex('giangvien')
            .join('users', 'giangvien.user_id', 'users.id')
            .select(
                'giangvien.maGV',
                'giangvien.hoDem',
                'giangvien.ten',
                'giangvien.ngaySinh',
                'giangvien.maKhoa',
                'giangvien.email',
                'users.id as user_id',
                'users.email',
                'users.role'
            )
            .where('giangvien.maGV', maGV)
            .first();

        if (!teacher) {
            console.log("Teacher not found for maGV:", maGV);
            return res.status(404).json({ error: "Giảng viên không tồn tại." });
        }

        console.log("Fetched teacher:", teacher);
        res.json(teacher);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin giảng viên:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi lấy thông tin giảng viên." });
    }
});

router.post("/teachers/add", async (req, res) => {
    try {
        const { email, password, hoDem, ten, maGV, ngaySinh, maKhoa } = req.body;

        await knex.transaction(async (trx) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [userId] = await trx('users').insert({
                email,
                password: hashedPassword,
                role: 'teacher'
            });

            await trx('giangvien').insert({
                maGV,
                user_id: userId,
                hoDem,
                ten,
                ngaySinh,
                maKhoa,
                email
            });
        });

        res.redirect("/admin/manage-teachers");
    } catch (error) {
        console.error("Lỗi khi thêm giảng viên:", error);
        res.status(500).send("Đã xảy ra lỗi khi thêm giảng viên.");
    }
});

router.post("/teachers/edit", async (req, res) => {
    try {
        const { maGV, email, password, hoDem, ten, ngaySinh, maKhoa } = req.body;

        await knex.transaction(async (trx) => {
            const teacher = await trx('giangvien').where('maGV', maGV).first();
            const userId = teacher.user_id;

            const userUpdate = { email };
            if (password) {
                userUpdate.password = await bcrypt.hash(password, 10);
            }
            await trx('users').where('id', userId).update(userUpdate);

            await trx('giangvien').where('maGV', maGV).update({
                hoDem,
                ten,
                ngaySinh,
                maKhoa,
                email
            });
        });

        res.redirect("/admin/manage-teachers");
    } catch (error) {
        console.error("Lỗi khi sửa giảng viên:", error);
        res.status(500).send("Đã xảy ra lỗi khi sửa giảng viên.");
    }
});

router.post("/teachers/delete/:maGV", async (req, res) => {
    try {
        const maGV = req.params.maGV;

        await knex.transaction(async (trx) => {
            const teacher = await trx('giangvien').where('maGV', maGV).first();
            const userId = teacher.user_id;

            await trx('giangvien').where('maGV', maGV).del();
            await trx('users').where('id', userId).del();
        });

        res.redirect("/admin/manage-teachers");
    } catch (error) {
        console.error("Lỗi khi xóa giảng viên:", error);
        res.status(500).send("Đã xảy ra lỗi khi xóa giảng viên.");
    }
});

module.exports = router;