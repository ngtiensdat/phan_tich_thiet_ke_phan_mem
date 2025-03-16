// public/js/profile.js
document.addEventListener('DOMContentLoaded', function() {
    const editInfoBtn = document.getElementById('edit-info-btn');
    const saveInfoBtn = document.getElementById('save-info-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    const avatarUpload = document.getElementById('avatar-upload');
    const teacherAvatar = document.getElementById('teacher-avatar');
    
    // Các trường thông tin giảng viên
    const teacherFields = [
        'teacher-hoDem',
        'teacher-ten',
        'teacher-ngaySinh',
        'teacher-email',
        'teacher-vaiTro'
    ];
    
    // Lưu trữ giá trị ban đầu để phục hồi nếu hủy
    let originalValues = {};
    
    // Bật chế độ chỉnh sửa
    function enableEdit() {
        // Lưu giá trị ban đầu
        teacherFields.forEach(field => {
            const element = document.getElementById(field);
            originalValues[field] = element.value;
            element.disabled = false;
        });
        
        // Hiển thị/ẩn các nút
        editInfoBtn.style.display = 'none';
        saveInfoBtn.style.display = 'inline-block';
        cancelEditBtn.style.display = 'inline-block';
        changeAvatarBtn.style.display = 'block';
    }
    
    // Hủy chế độ chỉnh sửa
    function cancelEdit() {
        // Khôi phục giá trị ban đầu
        teacherFields.forEach(field => {
            const element = document.getElementById(field);
            element.value = originalValues[field];
            element.disabled = true;
        });
        
        // Hiển thị/ẩn các nút
        editInfoBtn.style.display = 'inline-block';
        saveInfoBtn.style.display = 'none';
        cancelEditBtn.style.display = 'none';
        changeAvatarBtn.style.display = 'none';
    }
    
    // Lưu thông tin giảng viên
    async function saveTeacherInfo() {
        const formData = new FormData();
        
        // Thêm các trường thông tin vào formData
        formData.append('hoDem', document.getElementById('teacher-hoDem').value);
        formData.append('ten', document.getElementById('teacher-ten').value);
        formData.append('ngaySinh', document.getElementById('teacher-ngaySinh').value);
        formData.append('email', document.getElementById('teacher-email').value);
        formData.append('vaiTro', document.getElementById('teacher-vaiTro').value);
        
        // Thêm ảnh đại diện nếu có chọn
        if (avatarUpload.files.length > 0) {
            formData.append('avatar', avatarUpload.files[0]);
        }
        
        try {
            const response = await fetch('/teacher/profile/update', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Hiển thị thông báo thành công
                alert('Cập nhật thông tin thành công');
                
                // Vô hiệu hóa các trường và đặt lại trạng thái nút
                teacherFields.forEach(field => {
                    document.getElementById(field).disabled = true;
                });
                
                editInfoBtn.style.display = 'inline-block';
                saveInfoBtn.style.display = 'none';
                cancelEditBtn.style.display = 'none';
                changeAvatarBtn.style.display = 'none';
                
                // Cập nhật lại giá trị ban đầu
                teacherFields.forEach(field => {
                    originalValues[field] = document.getElementById(field).value;
                });
            } else {
                alert('Lỗi: ' + result.message);
            }
        } catch (error) {
            console.error('Error updating teacher info:', error);
            alert('Đã xảy ra lỗi khi cập nhật thông tin');
        }
    }
    
    // Xem trước ảnh đại diện khi chọn file
    avatarUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                teacherAvatar.src = e.target.result;
            };
            
            reader.readAsDataURL(this.files[0]);
        }
    });
    
    // Gắn sự kiện cho các nút
    if (editInfoBtn) editInfoBtn.addEventListener('click', enableEdit);
    if (saveInfoBtn) saveInfoBtn.addEventListener('click', saveTeacherInfo);
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', cancelEdit);
    if (changeAvatarBtn) changeAvatarBtn.addEventListener('click', function() {
        avatarUpload.click();
    });
});