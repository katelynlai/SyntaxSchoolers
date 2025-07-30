document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username-input").value;
    const password = document.getElementById("password-input").value;

     try {
        const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

        const res = await response.json();

        if (response.ok) {
            localStorage.setItem("token", res.token);
            localStorage.setItem("role", res.role);

        // Redirect based on role
        if (res.role === "Student") {
            window.location.href = "/dashboardPages/user_dashboard.html";
        } else {
            window.location.href = "/dashboardPages/teacher_dashboard.html";
      }
        } else {
            alert("Login failed: " + res.error || "Unknown error");
    }
  } catch (err) {
            console.error("Login error", err);
            alert("Something went wrong.");
  }
});