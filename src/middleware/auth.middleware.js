module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.session && req.session.user) {
            return next();
        }
        res.redirect("/auth/sign-in"); // Nếu chưa đăng nhập, chuyển về trang đăng nhập
    },

    ensureAdmin: (req, res, next) => {
        if (req.session && req.session.user && req.session.user.role === "admin") {
            return next();
        }
        res.status(403).send("🚫 Bạn không có quyền truy cập vào trang Admin.");
    },

    ensureTeacher: (req, res, next) => {
        if (req.session && req.session.user && req.session.user.role === "teacher") {
            return next();
        }
        res.status(403).send("🚫 Bạn không có quyền truy cập vào trang Giảng viên.");
    },

    ensureStudent: (req, res, next) => {
        if (req.session && req.session.user && req.session.user.role === "student") {
            return next();
        }
        res.status(403).send("🚫 Bạn không có quyền truy cập vào trang Sinh viên.");
    }
};
