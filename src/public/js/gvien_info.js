// gvien_info.js
function enableEdit() {
    const inputs = document.querySelectorAll('input[disabled], select[disabled]');
    inputs.forEach(input => input.disabled = false);
    document.getElementById('edit-info-btn').style.display = 'none';
    document.getElementById('save-info-btn').style.display = 'inline-block';
}

function saveGvienInfo() {
    const gvienData = {
        id: document.getElementById('gvien-id').value,
        lastname: document.getElementById('gvien-lastname').value,
        dob: document.getElementById('gvien-dob').value,
        firstname: document.getElementById('gvien-firstname').value,
        department: document.getElementById('gvien-department').value,
        specialization: document.getElementById('gvien-specialization').value,
        email: document.getElementById('gvien-email').value,
        degree: document.getElementById('gvien-degree').value,
        gender: document.getElementById('gvien-gender').value,
        role: document.getElementById('gvien-role').value,
        faculty: document.getElementById('gvien-faculty').value
    };

    // Send data to the server (e.g., via fetch or AJAX)
    fetch('/api/save-gvien', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gvienData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Thông tin đã được lưu thành công!');
        // Disable inputs again after saving
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => input.disabled = true);
        document.getElementById('edit-info-btn').style.display = 'inline-block';
        document.getElementById('save-info-btn').style.display = 'none';
    })
    .catch(error => console.error('Error:', error));
}