const knex = require('../../config/database');

class Course {
    static getAll() {
        return knex('tinchi').select('*');
    }

    // static getById(id) {
    //     return knex('courses').where('id', id).first();
    // }

    // static create(course) {
    //     return knex('courses').insert(course);
    // }

    // static update(id, course) {
    //     return knex('courses').where('id', id).update(course);
    // }

    // static delete(id) {
    //     return knex('courses').where('id', id).del();
    // }
}

module.exports = Course;
