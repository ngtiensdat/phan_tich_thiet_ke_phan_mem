function showForm(action) {
    document.getElementById('addForm').style.display = action === 'add' ? 'block' : 'none';
    document.getElementById('editForm').style.display = action === 'edit' ? 'block' : 'none';
    document.getElementById('deleteForm').style.display = action === 'delete' ? 'block' : 'none';
}

// Load dữ liệu môn học khi chọn để sửa
async function loadCourseData(maTinChi) {
    if (!maTinChi) return;
    try {
        const response = await fetch(`/admin/courses/${maTinChi}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const course = await response.json();
        if (course.error) {
            alert(course.error);
            return;
        }
        document.getElementById('editTenTinChi').value = course.tenTinChi || '';
        document.getElementById('editSoTinChi').value = course.soTinChi || '';
        document.getElementById('editMaKhoa').value = course.maKhoa || '';
        document.getElementById('editMaGV').value = course.maGV || '';
        document.getElementById('editMoTa').value = course.moTa || '';

        const scheduleResponse = await fetch(`/admin/courses/schedule/${maTinChi}`);
        if (!scheduleResponse.ok) {
            throw new Error(`HTTP error! Status: ${scheduleResponse.status}`);
        }
        const schedule = await scheduleResponse.json();
        document.getElementById('editPhong').value = schedule.phong || '';
        document.getElementById('editNgay').value = schedule.ngay || '';
        document.getElementById('editThu').value = schedule.thu || '';
        document.getElementById('editTietBD').value = schedule.tietBD || '';
        document.getElementById('editTietKT').value = schedule.tietKT || '';
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu môn học:', error);
        alert('Không thể tải dữ liệu môn học. Vui lòng thử lại sau.');
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