const Student = require("../models/student");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

exports.getProfile = async (req, res) => {
    const student = await Student.findByPk(req.session.userId);
    res.render("students/profile", { student });
};

exports.registerCourse = async (req, res) => {
    const { courseId } = req.body;
    await Enrollment.create({ studentId: req.session.userId, courseId });
    res.redirect("/student/schedule");
};

exports.getSchedule = async (req, res) => {
    const courses = await Enrollment.findAll({ where: { studentId: req.session.userId }, include: Course });
    res.render("students/schedule", { courses });
};

exports.cancelEnrollment = async (req, res) => {
    const { enrollmentId } = req.body;
    await Enrollment.destroy({ where: { id: enrollmentId } });
    res.redirect("/student/schedule");
};

exports.getStudents = async (req, res) => {
    const students = await Student.getAll();
    res.render('admin/manage-students', { students });
};

exports.updateStudentInfo = async (req, res) => {
    try {
        const { ngaySinh, gioiTinh, email } = req.body;
        const maSV = req.session.user.maSV;
        
        // Dữ liệu cập nhật
        const updateData = { 
            ngaySinh, 
            gioiTinh, 
            email 
        };
        
        // Nếu có file ảnh được upload
        if (req.file) {
            // Đường dẫn tương đối để lưu vào DB
            const relativePath = `/img/students/${req.file.filename}`;
            updateData.anhDaiDien = relativePath;
        }
        
        // Cập nhật thông tin sinh viên
        const updated = await Student.update(maSV, updateData);
        
        if (updated) {
            // Cập nhật session với thông tin mới
            if (req.file) {
                req.session.user.anhDaiDien = updateData.anhDaiDien;
            }
            
            req.session.user = {
                ...req.session.user,
                ngaySinh,
                gioiTinh,
                email
            };
            
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: 'Không thể cập nhật thông tin.' });
        }
    } catch (error) {
        console.error('Error updating student info:', error);
        return res.json({ success: false, message: 'Lỗi máy chủ.' });
    }
};
