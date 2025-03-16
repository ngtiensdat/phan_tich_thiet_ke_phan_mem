const bcrypt = require("bcrypt");
const knex = require("../config/database");

async function signUp(req, res) {
    const { email, password, role, hoDem, ten, ngaySinh } = req.body;

    if (!email || !password || !role || !hoDem || !ten || !ngaySinh) {
        return res.status(400).render("auth/sign-up", {
            error: "Vui lòng điền đầy đủ thông tin!",
            formData: req.body
        });
    }

    // Kiểm tra định dạng email dựa trên role
    if (role === 'student' && !email.endsWith('@st.phenikaa-uni.edu.vn')) {
        return res.status(400).render("auth/sign-up", {
            error: "Email sinh viên phải có định dạng @st.phenikaa-uni.edu.vn!",
            formData: req.body
        });
    } else if (role === 'teacher' && !email.endsWith('@phenikaa-uni.edu.vn')) {
        return res.status(400).render("auth/sign-up", {
            error: "Email giảng viên phải có định dạng @phenikaa-uni.edu.vn!",
            formData: req.body
        });
    }

    try {
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await knex("users").where({ email }).first();
        if (existingUser) {
            return res.status(400).render("auth/sign-up", {
                error: "Email đã tồn tại!",
                formData: req.body
            });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Bắt đầu transaction
        await knex.transaction(async (trx) => {
            // Thêm user vào database
            const [userId] = await trx("users").insert({
                email,
                password: hashedPassword,
                role,
            });

            // Thêm thông tin vào bảng tương ứng theo role
            if (role === 'student') {
                await trx("sinhvien").insert({
                    hoDem,
                    ten,
                    ngaySinh,
                    email,
                    vaiTro: 'student',
                    user_id: userId
                });
            } else if (role === 'teacher') {
                await trx("giangvien").insert({
                    hoDem,
                    ten,
                    ngaySinh,
                    email,
                    vaiTro: 'teacher',
                    user_id: userId
                });
            }
        });

        // Redirect và hiển thị thông báo thành công
        req.session.success = "Đăng ký thành công! Vui lòng đăng nhập.";
        res.redirect("/auth/sign-in");

    } catch (error) {
        console.error(error);
        res.status(500).render("auth/sign-up", {
            error: "Lỗi server, vui lòng thử lại sau!",
            formData: req.body
        });
    }
}

async function signIn(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Vui lòng nhập email và mật khẩu!"
        });
    }

    try {
        // Kiểm tra user có tồn tại không
        const user = await knex("users").where({ email }).first();
        if (!user) {
            return res.status(401).json({
                error: "Sai email hoặc mật khẩu!"
            });
        }

        // Kiểm tra mật khẩu
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: "Sai email hoặc mật khẩu!"
            });
        }

        // Lấy thêm thông tin từ bảng tương ứng
        let userInfo = null;
        if (user.role === 'student') {
            userInfo = await knex("sinhvien").where({ user_id: user.id }).first();
        } else if (user.role === 'teacher') {
            userInfo = await knex("giangvien").where({ user_id: user.id }).first();
        }

        // Lưu thông tin vào session
        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            ...userInfo  // Thêm thông tin từ bảng tương ứng
        };

        // Điều hướng dựa trên vai trò
        let redirectUrl = '/';
        if (user.role === 'admin') {
            redirectUrl = '/admin/dashboard'; // Chuyển thẳng đến /admin/dashboard cho admin
        } else if (user.role === 'teacher') {
            redirectUrl = '/teacher/homepage'; // Chuyển đến trang profile của giảng viên
        } else if (user.role === 'student') {
            redirectUrl = '/student/homepage'; // Chuyển đến trang profile của sinh viên
        }

        // Trả về JSON với URL chuyển hướng
        res.json({
            success: true,
            user: {
                email: user.email,
                role: user.role
            },
            redirectUrl: redirectUrl
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Lỗi server, vui lòng thử lại sau!"
        });
    }
}

async function signOut(req, res) {
    req.session.destroy(() => {
        res.redirect("/auth/sign-in");
    });
}

module.exports = { signUp, signIn, signOut };