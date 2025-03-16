$(document).ready(function() {
    // Xử lý đăng ký môn học
    $('.register-form').on('submit', function(e) {
        e.preventDefault();
        const form = $(this);
        const maTinChi = form.find('input[name="maTinChi"]').val();
        const row = form.closest('tr');

        $.ajax({
            url: '/student/enrollment/register',
            method: 'POST',
            data: { maTinChi: maTinChi },
            success: function(response) {
                if (response.success) {
                    // Thêm row vào enrolledCoursesTable
                    $('#enrolledCoursesTable tbody').append(row);
                    // Xóa row khỏi availableCoursesTable
                    row.remove();
                    showMessage('success', response.message);
                } else {
                    showMessage('danger', response.message);
                }
            },
            error: function(xhr, status, error) {
                showMessage('danger', 'Đã xảy ra lỗi khi gửi yêu cầu');
            }
        });
    });

    // Xử lý hủy đăng ký môn học
    $('.drop-form').on('submit', function(e) {
        e.preventDefault();
        const form = $(this);
        const maTinChi = form.find('button').data('ma-tin-chi');
        const row = form.closest('tr');

        $.ajax({
            url: `/student/enrollment/drop/${maTinChi}`,
            method: 'POST',
            success: function(response) {
                if (response.success) {
                    // Thêm row vào availableCoursesTable
                    $('#availableCoursesTable tbody').append(row);
                    // Xóa row khỏi enrolledCoursesTable
                    row.remove();
                    showMessage('success', response.message);
                } else {
                    showMessage('danger', response.message);
                }
            },
            error: function(xhr, status, error) {
                showMessage('danger', 'Đã xảy ra lỗi khi gửi yêu cầu');
            }
        });
    });

    // Hàm hiển thị thông báo
    function showMessage(type, message) {
        const messageContainer = $('#messageContainer');
        messageContainer.html(`
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
        setTimeout(() => {
            messageContainer.find('.alert').alert('close');
        }, 5000); // Tự động ẩn sau 5 giây
    }
});