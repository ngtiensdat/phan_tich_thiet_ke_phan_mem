// Các thẻ ẩn hiển
       function showSection(sectionId) {
            document.querySelectorAll('.content > div').forEach(div => div.style.display = 'none');
            document.getElementById(sectionId).style.display = 'block';
        }
// log out
function logout() {
    alert("Bạn đã đăng xuất thành công!");
    window.location.href = "../sign_in/sign_in.html"; 
}

function contactSupport() {
    alert("Liên hệ hỗ trợ qua email: support@example.com");
}

