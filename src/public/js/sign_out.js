async function logout() {
    const res = await fetch("/auth/sign-out", { method: "GET" });
    if (res.ok) {
        window.location.href = "/auth/sign-in";
    }
}

function cancel() {
    window.history.back();
}