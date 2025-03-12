from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from config import Config
from models import db, User, Course, Registration
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

# Tạo database khi khởi động
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            flash('Đăng nhập thành công!', 'success')
            return redirect(url_for('dashboard'))
        flash('Thông tin đăng nhập không đúng!', 'error')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if User.query.filter_by(username=username).first():
            flash('Tên người dùng đã tồn tại!', 'error')
        else:
            hashed_password = generate_password_hash(password)
            new_user = User(username=username, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            flash('Đăng ký thành công! Hãy đăng nhập.', 'success')
            return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    user = User.query.get(session['user_id'])
    courses = Course.query.all()
    registrations = Registration.query.filter_by(user_id=user.id).all()
    return render_template('dashboard.html', user=user, courses=courses, registrations=registrations)

@app.route('/course_registration', methods=['GET', 'POST'])
def course_registration():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user = User.query.get(session['user_id'])
    courses = Course.query.all()
    registrations = Registration.query.filter_by(user_id=user.id).all()
    registered_course_ids = [reg.course_id for reg in registrations]
    
    if request.method == 'POST':
        selected_courses = request.form.getlist('course_ids')
        for course_id in selected_courses:
            if int(course_id) not in registered_course_ids:
                new_registration = Registration(user_id=user.id, course_id=int(course_id))
                db.session.add(new_registration)
        db.session.commit()
        flash('Đăng ký môn học thành công!', 'success')
        return redirect(url_for('course_registration'))
    
    return render_template('course_registration.html', 
                         user=user, 
                         courses=courses, 
                         registrations=registrations, 
                         registered_course_ids=registered_course_ids)

@app.route('/timetable')
def timetable():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    user = User.query.get(session['user_id'])
    registrations = Registration.query.filter_by(user_id=user.id).all()
    return render_template('timetable.html', user=user, registrations=registrations)

# Route mới để xóa môn học
@app.route('/delete_course/<int:registration_id>')
def delete_course(registration_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    registration = Registration.query.get_or_404(registration_id)
    if registration.user_id != session['user_id']:
        flash('Bạn không có quyền xóa môn học này!', 'error')
        return redirect(url_for('timetable'))
    
    db.session.delete(registration)
    db.session.commit()
    flash('Xóa môn học thành công!', 'success')
    return redirect(url_for('timetable'))

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    flash('Đã đăng xuất!', 'success')
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)