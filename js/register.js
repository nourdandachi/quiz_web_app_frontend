console.log("register.js loaded.");

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("Submitting form...");

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);

        fetch('http://localhost/quiz_web_app_backend/api/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
        })
        .then(response => response.text())
        .then(data => {
            console.log("Server response:", data);
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
    });
});
