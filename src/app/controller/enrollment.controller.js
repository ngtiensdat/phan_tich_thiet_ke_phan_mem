// C:\PT\phan_tich_thiet_ke_phan_mem\src\app\controller\enrollment.controller.js
const knex = require('../../config/database');

exports.getStudentCourses = async (req, res) => {
    try {
        const studentId = req.session.user.maSV;
        
        // Lấy thông tin sinh viên và khoa
        const student = await knex('sinhvien')
            .join('khoa', 'sinhvien.maKhoa', 'khoa.maKhoa')
            .select('sinhvien.*', 'khoa.tenKhoa')
            .where('sinhvien.maSV', studentId)
            .first();
            
        if (!student) {
            return res.status(404).send('Không tìm thấy thông tin sinh viên');
        }
        
        // Lấy các môn học đã đăng ký
        const enrolledCourses = await knex('sinhvien_tinchi as svtc')
            .join('tinchi as tc', 'svtc.maTinChi', 'tc.maTinChi')
            .leftJoin('giangvien as gv', 'tc.maGV', 'gv.maGV')
            .select(
                'tc.maTinChi',
                'tc.tenTinChi',
                'tc.soTinChi',
                'tc.lichHoc',
                'tc.diaDiem',
                knex.raw('CONCAT(gv.hoDem, " ", gv.ten) as tenGiangVien')
            )
            .where('svtc.maSV', studentId);
            
        // Lấy các môn học có thể đăng ký
        const availableCourses = await knex('tinchi as tc')
            .leftJoin('giangvien as gv', 'tc.maGV', 'gv.maGV')
            .select(
                'tc.maTinChi',
                'tc.tenTinChi',
                'tc.soTinChi',
                'tc.lichHoc',
                'tc.diaDiem',
                knex.raw('CONCAT(gv.hoDem, " ", gv.ten) as tenGiangVien')
            )
            .where(function() {
                this.where('tc.maKhoa', student.maKhoa)
                    .orWhere('tc.moTa', 'like', '%Môn chung cho tất cả các khoa%');
            })
            .whereNotIn('tc.maTinChi', function() {
                this.select('maTinChi')
                    .from('sinhvien_tinchi')
                    .where('maSV', studentId);
            });
        
        res.render('student/enrollment', {
            user: req.session.user,
            enrolledCourses,
            availableCourses,
            student
        });
        
    } catch (error) {
        console.error('Lỗi khi lấy danh sách môn học:', error);
        res.status(500).send('Đã xảy ra lỗi khi tải trang');
    }
};

exports.registerCourse = async (req, res) => {
    try {
        const studentId = req.session.user.maSV;
        const { maTinChi } = req.body;
        
        // Kiểm tra xem sinh viên đã đăng ký môn học này chưa
        const existingEnrollment = await knex('sinhvien_tinchi')
            .where({
                maSV: studentId,
                maTinChi: maTinChi
            })
            .first();
            
        if (existingEnrollment) {
            return res.status(400).json({ success: false, message: 'Bạn đã đăng ký môn học này rồi' });
        }
        
        // Lấy thông tin về học kỳ hiện tại
        const hocKy = 1; // Ví dụ: học kỳ 1
        const namHoc = '2024-2025'; // Ví dụ: năm học 2024-2025
        
        // Đăng ký môn học
        await knex('sinhvien_tinchi').insert({
            maSV: studentId,
            maTinChi: maTinChi,
            hocKy: hocKy,
            namHoc: namHoc
        });
        
        return res.json({ success: true, message: 'Đăng ký môn học thành công' });
        
    } catch (error) {
        console.error('Lỗi khi đăng ký môn học:', error);
        return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi đăng ký môn học' });
    }
};

exports.dropCourse = async (req, res) => {
    try {
        const studentId = req.session.user.maSV;
        const courseId = req.params.maTinChi; // Thay vì req.params.id, sử dụng maTinChi
        
        // Xóa đăng ký môn học
        await knex('sinhvien_tinchi')
            .where({
                maSV: studentId,
                maTinChi: courseId
            })
            .del();
            
        return res.json({ success: true, message: 'Hủy đăng ký môn học thành công' });
        
    } catch (error) {
        console.error('Lỗi khi hủy đăng ký môn học:', error);
        return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi hủy đăng ký môn học' });
    }
};