import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDla-CSFtR6-y2vscJjuX6Q0vp0x0TTLT4",
    authDomain: "dangkytinchi-73b7a.firebaseapp.com",
    projectId: "dangkytinchi-73b7a",
    storageBucket: "dangkytinchi-73b7a.appspot.com",
    databaseURL: "https://dangkytinchi-73b7a-default-rtdb.firebaseio.com",
    messagingSenderId: "1013393708459",
    appId: "1:1013393708459:web:21be9269a148ed83386eee"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

function showMessage(message) {
    alert(message);
}

window.login = function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showMessage("Vui lòng nhập email và mật khẩu!");
        return;
    }

    if (!email.endsWith("@st.phenikaa.com")) {
        showMessage("Chỉ sinh viên Phenikaa mới có thể đăng nhập!");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            showMessage("Đăng nhập thành công!");
            window.location.href = "../interface/main_interface.html";
        })
        .catch(error => showMessage("Lỗi: " + error.message));
};
