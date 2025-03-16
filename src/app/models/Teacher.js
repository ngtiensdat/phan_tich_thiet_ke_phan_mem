const knex = require('../../config/database');

class Teacher {
    static getAll() {
        return knex('giangvien');
    }

    static getById(id) {
        return knex('giangvien').where('maGV', id).first();
    }

    static getByUserId(userId) {
        return knex('giangvien').where('user_id', userId).first();
    }

    static async getTeacherWithDepartment(userId) {
        const teacher = await knex('giangvien as gv')
            .select('gv.*', 'k.tenKhoa')
            .leftJoin('khoa as k', 'gv.maKhoa', 'k.maKhoa')
            .where('gv.user_id', userId)
            .first();
        return teacher;
    }

    static update(maGV, updateData) {
        return knex('giangvien')
            .where('maGV', maGV)
            .update(updateData);
    }
}

module.exports = Teacher;