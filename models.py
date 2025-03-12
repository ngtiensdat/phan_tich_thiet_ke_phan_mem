from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    registrations = db.relationship('Registration', backref='user', lazy=True)

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    credits = db.Column(db.Integer, nullable=False)
    day_of_week = db.Column(db.String(20), nullable=False)  # Thứ trong tuần (VD: Thứ 2, Thứ 3)
    time = db.Column(db.String(20), nullable=False)         # Giờ học (VD: 7:00-9:00)
    room = db.Column(db.String(50), nullable=False)         # Phòng học (VD: A101)
    lecturer = db.Column(db.String(100), nullable=False)    # Giảng viên (VD: Nguyễn Văn A)
    registrations = db.relationship('Registration', backref='course', lazy=True)

class Registration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)