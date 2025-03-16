// C:\PT\phan_tich_thiet_ke_phan_mem\src\app\models\Student.js
const knex = require('../../config/database');

class Student {
    static getAll() {
        return knex('sinhvien');
    }

    static getById(id) {
        return knex('sinhvien').where('maSV', id).first();
    }

    static async getStudentWithDepartment(maSV) {
        const student = await knex('sinhvien as s')
            .select('s.*', 'k.tenKhoa')
            .leftJoin('khoa as k', 's.maKhoa', 'k.maKhoa')
            .where('s.maSV', maSV)
            .first();
        return student;
    }

    static update(maSV, updateData) {
        return knex('sinhvien')
            .where('maSV', maSV)
            .update(updateData);
    }
}

module.exports = Student;