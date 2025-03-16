function enableEdit() {
    // Bật chế độ chỉnh sửa cho tất cả input trừ các trường không được phép chỉnh sửa
    const editableFields = [
        'student-ngaySinh', 'student-gioiTinh', 'student-email'
    ];
    
    editableFields.forEach(id => {
        document.getElementById(id).disabled = false;
    });
    
    // Hiện nút thay đổi avatar
    document.getElementById('change-avatar-btn').style.display = 'block';
    
    // Ẩn nút chỉnh sửa, hiện nút lưu
    document.getElementById('edit-info-btn').style.display = 'none';
    document.getElementById('save-info-btn').style.display = 'block';
}

// Format date to yyyy-MM-dd format for input[type="date"]
function formatDateForInput(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// When the page loads, ensure date is in correct format
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('student-ngaySinh');
    if(dateInput && dateInput.value) {
        try {
            dateInput.value = formatDateForInput(dateInput.value);
        } catch(e) {
            console.error('Error formatting date:', e);
        }
    }
});

// Thêm sự kiện cho việc chọn file ảnh
document.getElementById('avatar-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        // Hiển thị preview của ảnh đã chọn
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('student-avatar').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

async function saveStudentInfo() {
    // Kiểm tra format ngày tháng trước khi submit
    const dateInput = document.getElementById('student-ngaySinh');
    if(dateInput && dateInput.value) {
        // Kiểm tra nếu định dạng ngày không hợp lệ
        if(!dateInput.checkValidity()) {
            alert('Ngày sinh không đúng định dạng. Vui lòng nhập theo định dạng YYYY-MM-DD');
            return;
        }
    }
    
    // Tạo FormData để gửi cả dữ liệu form và file
    const formData = new FormData();
    
    // Thêm các trường thông tin text
    formData.append('ngaySinh', document.getElementById('student-ngaySinh').value);
    formData.append('gioiTinh', document.getElementById('student-gioiTinh').value);
    formData.append('email', document.getElementById('student-email').value);
    
    // Thêm file ảnh nếu có
    const avatarInput = document.getElementById('avatar-upload');
    if (avatarInput.files.length > 0) {
        formData.append('avatar', avatarInput.files[0]);
    }
    
    try {
        const response = await fetch('/student/update-info', {
            method: 'POST',
            body: formData // Không cần set Content-Type header khi dùng FormData
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Cập nhật thông tin thành công!');
            
            // Vô hiệu hóa các trường nhập liệu
            const editableFields = [
                'student-ngaySinh', 'student-gioiTinh', 'student-email'
            ];
            
            editableFields.forEach(id => {
                document.getElementById(id).disabled = true;
            });
            
            // Ẩn nút thay đổi avatar
            document.getElementById('change-avatar-btn').style.display = 'none';
            
            // Hiện nút chỉnh sửa, ẩn nút lưu
            document.getElementById('edit-info-btn').style.display = 'block';
            document.getElementById('save-info-btn').style.display = 'none';
        } else {
            alert('Cập nhật thông tin thất bại: ' + result.message);
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin:', error);
        alert('Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại sau.');
    }
}