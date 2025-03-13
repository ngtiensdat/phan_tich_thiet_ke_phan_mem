const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình Express-Handlebars
const hbs = exphbs.create({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "resources", "view", "layouts"),
    helpers: {
        eq: function (a, b, options) {
            const result = a === b;
            console.log("Comparing:", a, b, "Result:", result); // Debug log
            if (options && typeof options.fn === "function") {
                return result ? options.fn(this) : options.inverse(this);
            }
            return result;
        },
    },
});

hbs.handlebars.registerHelper("eq", function (a, b, options) {
    const result = a === b;
    console.log("Helper registered and comparing:", a, b, "Result:", result); // Debug log
    if (options && typeof options.fn === "function") {
        return result ? options.fn(this) : options.inverse(this);
    }
    return result;
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "view")); // Path to views directory

// Middleware để phục vụ file tĩnh (CSS, JS, hình ảnh)
app.use(express.static(path.join(__dirname, "public")));

// Routes
const signInRouter = require("./routers/sign_in.routes");
const homepageRouter = require("./routers/homepage.routes");
const registrationRouter = require("./routers/registration.routes");
const studentInfoRouter = require("./routers/student_info.routes");
const scheduleRouter = require("./routers/schedule.routes");
const gvienInfoRouter = require("./routers/gvien_info.routes");

// Route trang chủ -> sử dụng homepage.routes
app.use("/", homepageRouter);

// Route trang đăng nhập
app.use("/sign_in", signInRouter);
// Trang đăng ký
app.use("/registration", registrationRouter);

// Thông tin sinh viên
app.use("/student_info", studentInfoRouter); // Sử dụng /student_info như trong mã của bạn

// Thời khóa biểu
app.use("/schedule", scheduleRouter); // Sử dụng /schedule như trong mã của bạn

//giao vien info
app.use("/gvien_info", gvienInfoRouter);

console.log("Current directory:", __dirname);
console.log("Views directory:", path.join(__dirname, "resources", "view")); // Debug log

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});