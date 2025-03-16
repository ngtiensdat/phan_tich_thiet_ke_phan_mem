require('dotenv').config();

const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const knex = require("./config/database");
const session = require("express-session");


const PORT = process.env.PORT || 5000;
const app = express();

// Middleware logging
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cấu hình Express-Handlebars
const hbs = exphbs.create({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "resources", "view", "layouts"),
    helpers: {
        eq: function (a, b) {
            return a === b;
        },
        formatDate: function (date) {
            return new Date(date).toLocaleDateString('vi-VN');
        },
        formatDateInput: function (date) {
            if (!date) return '';
            const d = new Date(date);
            return d.getFullYear() + '-' +
                String(d.getMonth() + 1).padStart(2, '0') + '-' +
                String(d.getDate()).padStart(2, '0');
        },
        add: function (a, b) {
            return a + b;
        }
    },
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "view"));

// Middleware phục vụ file tĩnh
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình session
app.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Import các route chính
const adminRouter = require("./routers/admin.routes");
const studentRouter = require("./routers/student.routes");
const teacherRouter = require("./routers/teacher.routes");
const authRouter = require("./routers/auth.routes");

// Định tuyến
app.use("/admin", adminRouter);
app.use("/student", studentRouter);
app.use("/teacher", teacherRouter);
app.use("/auth", authRouter);

// Trang chủ
app.get("/", (req, res) => {
    if (req.session.user) {
        // Nếu đã đăng nhập, chuyển hướng theo vai trò
        if (req.session.user.vaiTro === "admin") return res.redirect("/admin");
        if (req.session.user.vaiTro === "student") return res.redirect("/student");
        if (req.session.user.vaiTro === "teacher") return res.redirect("/teacher");
    }
    // Nếu chưa đăng nhập, hiển thị trang đăng nhập
    res.redirect("/auth/sign-in");
});

app.get("/api/student/schedule", async (req, res) => {
    try {
        const { day, month, year } = req.query;
        const maSV = req.session.user.maSV;

        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        const weekday = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][dayOfWeek];

        const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const scheduleItems = await knex('sinhvien_tinchi as svtc')
            .join('tinchi as tc', 'svtc.maTinChi', 'tc.maTinChi')
            .join('lichhoc_tinchi as lh', 'tc.maTinChi', 'lh.maTinChi')
            .leftJoin('giangvien as gv', 'lh.maGV', 'gv.maGV')
            .select(
                'tc.tenTinChi',
                'lh.tietBD',
                'lh.tietKT',
                'lh.phong',
                'lh.thu',
                'lh.ngay',
                knex.raw('CONCAT(gv.hoDem, " ", gv.ten) as tenGV')
            )
            .where('svtc.maSV', maSV)
            .where(function() {
                this.where('lh.ngay', formattedDate)
                    .orWhere('lh.thu', weekday);
            });

        res.json(scheduleItems);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy lịch học' });
    }
});

// Lắng nghe cổng
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
