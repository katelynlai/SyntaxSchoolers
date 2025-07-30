document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstname: form.get("firstname"),
            surname: form.get("surname"),
            username: form.get("username"),
            password: form.get("password"),
            role: form.get("role")
        })
    }

    try {

        const response = await fetch("http://localhost:3000/users/register", options);
        
        let data = {};

        try {
            data = await response.json();
        } catch (err) {
            console.warn("No JSON returned");
        }

        if (response.status == 201) {
            window.location.assign("../loginPage/login.html");
    } else {
        alert(data.error || "Registration failed");
    }
} catch (err) {
        console.error("Registration error", err);
        alert("Something went wrong. Please try again");
    }
});