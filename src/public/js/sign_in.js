async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
        // Để server xử lý chuyển hướng thay vì tự chuyển hướng ở client
        const data = await res.json();
        if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
        } else {
            // Fallback nếu server không trả về URL chuyển hướng
            const role = data.user?.role || "student";
            window.location.href = `/${role}/homepage`;
        }
    } else {
        const data = await res.json();
        alert(data.error);
    }
}