// Enrollment.js
const knex = require('../../config/database');

class Enrollment {
    // Lấy danh sách các môn học đã đăng ký của sinh viên
    static async getStudentCourses(studentId) {
        try {
            return await knex('sinhvien_tinchi as svtc')
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
        } catch (error) {
            console.error('Error in getStudentCourses:', error);
            throw error;
        }
    }

    // Đăng ký môn học cho sinh viên
    static async enrollStudent(studentId, courseId) {
        try {
            // Kiểm tra xem sinh viên đã đăng ký môn học này chưa
            const existingEnrollment = await knex('sinhvien_tinchi')
                .where({
                    maSV: studentId,
                    maTinChi: courseId
                })
                .first();

            if (existingEnrollment) {
                throw new Error('Sinh viên đã đăng ký môn học này rồi');
            }

            // Lấy thông tin về học kỳ hiện tại (có thể lấy từ cấu hình hệ thống)
            const hocKy = 1; // Ví dụ: học kỳ 1
            const namHoc = '2024-2025'; // Ví dụ: năm học 2024-2025

            // Đăng ký môn học
            return await knex('sinhvien_tinchi').insert({
                maSV: studentId,
                maTinChi: courseId,
                hocKy: hocKy,
                namHoc: namHoc
            });
        } catch (error) {
            console.error('Error in enrollStudent:', error);
            throw error;
        }
    }

    // Hủy đăng ký môn học
    static async dropStudent(studentId, courseId) {
        try {
            return await knex('sinhvien_tinchi')
                .where({
                    maSV: studentId,
                    maTinChi: courseId
                })
                .del();
        } catch (error) {
            console.error('Error in dropStudent:', error);
            throw error;
        }
    }

    // Lấy danh sách các môn học có thể đăng ký cho sinh viên
    static async getAvailableCourses(studentId) {
        try {
            // Lấy thông tin khoa của sinh viên
            const student = await knex('sinhvien')
                .select('maKhoa')
                .where('maSV', studentId)
                .first();

            if (!student) {
                throw new Error('Không tìm thấy thông tin sinh viên');
            }

            // Lấy các môn học có thể đăng ký (môn học của khoa và môn học chung)
            return await knex('tinchi as tc')
                .leftJoin('giangvien as gv', 'tc.maGV', 'gv.maGV')
                .select(
                    'tc.maTinChi',
                    'tc.tenTinChi',
                    'tc.soTinChi',
                    'tc.lichHoc',
                    'tc.diaDiem',
                    knex.raw('CONCAT(gv.hoDem, " ", gv.ten) as tenGiangVien')
                )
                .where(function () {
                    // Môn học của khoa sinh viên hoặc môn học chung
                    this.where('tc.maKhoa', student.maKhoa)
                        .orWhere('tc.moTa', 'like', '%Môn chung cho tất cả các khoa%');
                })
                .whereNotIn('tc.maTinChi', function () {
                    // Loại trừ các môn đã đăng ký
                    this.select('maTinChi')
                        .from('sinhvien_tinchi')
                        .where('maSV', studentId);
                });
        } catch (error) {
            console.error('Error in getAvailableCourses:', error);
            throw error;
        }
    }
}

module.exports = Enrollment;