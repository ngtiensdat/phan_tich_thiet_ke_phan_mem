const Teacher = require("../models/Teacher");
const Course = require("../models/Course");
const knex = require('../../config/database');

exports.getProfile = async (req, res) => {
    const teacher = await Teacher.findByPk(req.session.userId);
    res.render("teachers/profile", { teacher });
}

exports.getSchedule = async (req, res) => {
    const courses = await Course.findAll({ where: { teacherId: req.session.userId } });
    res.render("teachers/schedule", { courses });
};

exports.getEnrolledStudents = async (req, res) => {
    const { courseId } = req.params;
    const students = await Enrollment.findAll({ where: { courseId }, include: Student });
    res.render("teachers/students", { students });
};

exports.getTeachers = async (req, res) => {
    const teachers = await Teacher.getAll();
    res.render('admin/manage-teachers', { teachers });
};

exports.getProfile = async (req, res) => {
    try {
        // Lấy thông tin giảng viên từ database với thông tin khoa
        // Sử dụng user_id từ session để tìm giảng viên tương ứng
        const teacherInfo = await Teacher.getTeacherWithDepartment(req.session.user.id);
        
        if (!teacherInfo) {
            return res.render("teacher/profile", { 
                user: req.session.user,
                error: 'Không tìm thấy thông tin giảng viên' 
            });
        }
        
        // Render trang profile với thông tin giảng viên
        res.render("teacher/profile", { 
            user: req.session.user,
            teacherInfo: teacherInfo
        });
    } catch (error) {
        console.error("Error fetching teacher profile:", error);
        res.render("teacher/profile", { 
            user: req.session.user,
            error: 'Đã xảy ra lỗi khi tải thông tin giảng viên' 
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { hoDem, ten, ngaySinh, email, vaiTro } = req.body;
        const teacher = await Teacher.getByUserId(req.session.user.id);
        
        if (!teacher) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy thông tin giảng viên' 
            });
        }
        
        // Cập nhật thông tin giảng viên
        await Teacher.update(teacher.maGV, {
            hoDem,
            ten,
            ngaySinh,
            email,
            vaiTro
        });
        
        // Cập nhật ảnh đại diện nếu có
        if (req.file) {
            const avatarPath = `/uploads/avatars/${req.file.filename}`;
            await Teacher.update(teacher.maGV, { anhDaiDien: avatarPath });
        }
        
        res.json({ success: true, message: 'Cập nhật thông tin thành công' });
    } catch (error) {
        console.error("Error updating teacher profile:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Đã xảy ra lỗi khi cập nhật thông tin giảng viên' 
        });
    }
};

exports.getClassStudents = async (req, res) => {
    try {
        const teacherId = req.session.user.id;
        let maTinChi = req.query.maTinChi;

        // Get teacher info
        const teacher = await knex('giangvien')
            .where('user_id', teacherId)
            .first();
        
        if (!teacher) {
            return res.status(404).send("Không tìm thấy thông tin giảng viên.");
        }
        
        // Get all courses taught by the teacher
        const courses = await knex('tinchi')
            .where('maGV', teacher.maGV)
            .select('maTinChi', 'tenTinChi', 'soTinChi');
        
        // Default values for selected course data
        let selectedCourse = null;
        let department = null;
        let schedule = null;
        let students = [];
        
        // If a specific course is requested, get its details and students
        if (maTinChi) {
            // Convert maTinChi to integer
            maTinChi = parseInt(maTinChi);
            if (!isNaN(maTinChi)) {
                // Get selected course details
                selectedCourse = await knex('tinchi')
                    .where('maTinChi', maTinChi)
                    .where('maGV', teacher.maGV)
                    .first();
                
                if (selectedCourse) {
                    // Get department info
                    department = await knex('khoa')
                        .where('maKhoa', selectedCourse.maKhoa)
                        .first();

                    // Get schedule
                    schedule = await knex('lichhoc_tinchi')
                        .where('maTinChi', maTinChi)
                        .first();

                    // Get enrolled students
                    students = await knex('sinhvien_tinchi')
                        .join('sinhvien', 'sinhvien_tinchi.maSV', 'sinhvien.maSV')
                        .where('sinhvien_tinchi.maTinChi', maTinChi)
                        .select(
                            'sinhvien.maSV',
                            'sinhvien.hoDem',
                            'sinhvien.ten',
                            'sinhvien.email',
                            'sinhvien.lop',
                            'sinhvien.nganh',
                            'sinhvien.khoaHoc',
                            'sinhvien.nienKhoa',
                            'sinhvien_tinchi.hocKy',
                            'sinhvien_tinchi.namHoc'
                        );
                }
            }
        }

        // Render everything in the same template
        res.render('teacher/class-student', {
            user: req.session.user,
            courses: courses || [],
            selectedCourse: selectedCourse,
            maTinChi: selectedCourse ? selectedCourse.maTinChi : null,
            tenTinChi: selectedCourse ? selectedCourse.tenTinChi : null,
            soTinChi: selectedCourse ? selectedCourse.soTinChi : null,
            moTa: selectedCourse ? selectedCourse.moTa : null,
            khoa: department || { tenKhoa: 'Môn chung' },
            lichHoc: schedule ? `${schedule.thu}, Tiết ${schedule.tietBD} - ${schedule.tietKT}` : 'Chưa có lịch học',
            diaDiem: schedule ? schedule.phong : 'Chưa có địa điểm',
            hocKy: students.length > 0 ? students[0].hocKy : 'Chưa xác định',
            namHoc: students.length > 0 ? students[0].namHoc : 'Chưa xác định',
            students: students || []
        });
        
    } catch (error) {
        console.error("Error fetching class students:", error);
        res.status(500).send("Đã xảy ra lỗi khi lấy thông tin lớp học.");
    }
};