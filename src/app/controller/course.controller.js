const Course = require('../models/Course');

exports.getCourses = async (req, res) => {
    const courses = await Course.getAll();
    res.render('admin/manage-courses', { courses });
};

exports.createCourse = async (req, res) => {
    const { name, credits } = req.body;
    await Course.create({ name, credits });
    res.redirect('/admin/manage-courses');
};

exports.updateCourse = async (req, res) => {
    const { id, name, credits } = req.body;
    await Course.update(id, { name, credits });
    res.redirect('/admin/manage-courses');
};

exports.deleteCourse = async (req, res) => {
    const { id } = req.params;
    await Course.delete(id);
    res.redirect('/admin/manage-courses');
};
