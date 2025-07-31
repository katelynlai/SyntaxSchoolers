document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const username = form.get("username");
    const password = form.get("password");
    const role = form.get("role");

    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, role })
    };

    try {
        const response = await fetch("http://localhost:3000/users/login", options);
        const data = await response.json();

        if (response.status === 200) {
            localStorage.setItem("token", data.token);

            // Optional: Save role in localStorage
            localStorage.setItem("role", role);

            // Redirect based on selected role
            if (role === "student") {
                window.location.assign("../user_dashboard/user_dashboard.html");
            } else if (role === "staff") {
                window.location.assign("../staff_dashboard/staff_dashboard.html");
            }
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error("Login failed:", err);
        alert("An error occurred during login.");
    }
});
