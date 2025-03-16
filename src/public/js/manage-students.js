function showForm(action) {
    document.getElementById('addForm').style.display = action === 'add' ? 'block' : 'none';
    document.getElementById('editForm').style.display = action === 'edit' ? 'block' : 'none';
    document.getElementById('deleteForm').style.display = action === 'delete' ? 'block' : 'none';
}

// Load dữ liệu sinh viên khi chọn để sửa
async function loadStudentData(maSV) {
    if (!maSV) return;
    try {
        const response = await fetch(`/admin/students/${maSV}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const student = await response.json();
        if (student.error) {
            alert(student.error);
            return;
        }
        document.getElementById('editEmail').value = student.email || '';
        document.getElementById('editHoDem').value = student.hoDem || '';
        document.getElementById('editTen').value = student.ten || '';
        document.getElementById('editNgaySinh').value = student.ngaySinh || '';
        document.getElementById('editGioiTinh').value = student.gioiTinh || '';
        document.getElementById('editLop').value = student.lop || '';
        document.getElementById('editMaKhoa').value = student.maKhoa || '';
        document.getElementById('editKhoaHoc').value = student.khoaHoc || '';
        document.getElementById('editNienKhoa').value = student.nienKhoa || '';
        document.getElementById('editNganh').value = student.nganh || '';
        document.getElementById('editHeDaoTao').value = student.heDaoTao || '';
        document.getElementById('editTrangThai').value = student.trangThai || '';
        document.getElementById('editChuongTrinhDaoTao').value = student.chuongTrinhDaoTao || '';
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu sinh viên:', error);
        alert('Không thể tải dữ liệu sinh viên. Vui lòng thử lại sau.');
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