const Course = require("../models/Course");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

exports.manageCourses = async (req, res) => {
    const courses = await Course.findAll();
    res.render("admin/manageCourses", { courses });
};

exports.addCourse = async (req, res) => {
    await Course.create(req.body);
    res.redirect("/admin/courses");
};

exports.deleteCourse = async (req, res) => {
    await Course.destroy({ where: { id: req.params.id } });
    res.redirect("/admin/courses");
};

exports.manageStudents = async (req, res) => {
    const students = await Student.findAll();
    res.render("admin/manageStudents", { students });
};

exports.manageTeachers = async (req, res) => {
    const teachers = await Teacher.findAll();
    res.render("admin/manageTeachers", { teachers });
};
