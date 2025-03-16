function showForm(action) {
    document.getElementById('addForm').style.display = action === 'add' ? 'block' : 'none';
    document.getElementById('editForm').style.display = action === 'edit' ? 'block' : 'none';
    document.getElementById('deleteForm').style.display = action === 'delete' ? 'block' : 'none';
}

// Hàm định dạng ngày thành yyyy-MM-dd (tương tự manage-students.hbs)
function formatDateToInput(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Load dữ liệu giảng viên khi chọn để sửa
async function loadTeacherData(maGV) {
    if (!maGV) return;
    try {
        const response = await fetch(`/admin/teachers/${maGV}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const teacher = await response.json();
        if (teacher.error) {
            alert(teacher.error);
            return;
        }
        document.getElementById('editEmail').value = teacher.email || '';
        document.getElementById('editHoDem').value = teacher.hoDem || '';
        document.getElementById('editTen').value = teacher.ten || '';
        document.getElementById('editNgaySinh').value = formatDateToInput(teacher.ngaySinh);
        document.getElementById('editMaKhoa').value = teacher.maKhoa || '';
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu giảng viên:', error);
        alert('Không thể tải dữ liệu giảng viên. Vui lòng thử lại sau.');
    }
}

// Form validation
(function() {
    'use strict';
    var forms = document.querySelectorAll('.needs-validation');
    Array.prototype.slice.call(forms).forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
})();