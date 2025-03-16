// File: public/js/sign_up.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                this.submit();
            }
        });
    }
    
    // Thêm event listener cho trường role để điều chỉnh yêu cầu email
    const roleSelect = document.getElementById('role');
    if (roleSelect) {
        roleSelect.addEventListener('change', function() {
            const emailHelp = document.getElementById('emailHelpBlock');
            const selectedRole = this.value;
            
            if (selectedRole === 'student') {
                emailHelp.innerHTML = 'Email sinh viên phải có định dạng <strong>@st.phenikaa-uni.edu.vn</strong>';
            } else if (selectedRole === 'teacher') {
                emailHelp.innerHTML = 'Email giảng viên phải có định dạng <strong>@phenikaa-uni.edu.vn</strong>';
            }
        });
    }
});

function validateForm() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;
    const hoDem = document.getElementById('hoDem').value.trim();
    const ten = document.getElementById('ten').value.trim();
    const ngaySinh = document.getElementById('ngaySinh').value;
    
    const alertDiv = document.getElementById('alertMessage');
    
    // Kiểm tra các trường trống
    if (!email || !password || !confirmPassword || !role || !hoDem || !ten || !ngaySinh) {
        showAlert('Vui lòng điền đầy đủ thông tin!');
        return false;
    }
    
    // Kiểm tra mật khẩu khớp nhau
    if (password !== confirmPassword) {
        showAlert('Mật khẩu nhập lại không khớp!');
        return false;
    }
    
    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
        showAlert('Mật khẩu phải có ít nhất 6 ký tự!');
        return false;
    }
    
    // Kiểm tra định dạng email theo role
    if (role === 'student' && !email.endsWith('@st.phenikaa-uni.edu.vn')) {
        showAlert('Email sinh viên phải có định dạng @st.phenikaa-uni.edu.vn!');
        return false;
    } else if (role === 'teacher' && !email.endsWith('@phenikaa-uni.edu.vn')) {
        showAlert('Email giảng viên phải có định dạng @phenikaa-uni.edu.vn!');
        return false;
    }
    
    // Kiểm tra ngày sinh
    const birthDate = new Date(ngaySinh);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (birthDate > today) {
        showAlert('Ngày sinh không hợp lệ!');
        return false;
    }
    
    if (role === 'student' && (age < 17 || age > 60)) {
        showAlert('Tuổi của sinh viên không hợp lệ (phải từ 17-60 tuổi)!');
        return false;
    }
    
    if (role === 'teacher' && (age < 22 || age > 70)) {
        showAlert('Tuổi của giảng viên không hợp lệ (phải từ 22-70 tuổi)!');
        return false;
    }
    
    // Ẩn thông báo lỗi nếu mọi thứ hợp lệ
    alertDiv.style.display = 'none';
    
    return true;
}

function showAlert(message) {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';
    
    // Cuộn đến thông báo lỗi
    alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}