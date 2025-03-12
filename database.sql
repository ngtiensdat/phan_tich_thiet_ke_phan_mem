CREATE DATABASE IF NOT EXISTS credit_registration;
USE credit_registration;

drop database credit_registration

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    password VARCHAR(120) NOT NULL
);

CREATE TABLE course (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    credits INT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    time VARCHAR(20) NOT NULL,
    room VARCHAR(50) NOT NULL,
    lecturer VARCHAR(100) NOT NULL
);

CREATE TABLE registration (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (course_id) REFERENCES course(id)
);

-- Thêm dữ liệu mẫu
INSERT INTO course (name, credits, day_of_week, time, room, lecturer) VALUES
('Lập trình Python', 3, 'Thứ 2', '7:00-9:00', 'A101', 'Nguyễn Văn A'),
('Cơ sở dữ liệu', 3, 'Thứ 4', '13:00-15:00', 'B202', 'Trần Thị B'),
('Toán rời rạc', 2, 'Thứ 6', '9:00-11:00', 'C303', 'Lê Văn C');