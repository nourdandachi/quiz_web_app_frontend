const loginForm = document.getElementById("login-form");
const errorMsg = document.getElementById("error-msg");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  fetch('http://localhost/quiz_web_app_backend/api/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "success") {
      sessionStorage.setItem("loggedInUser", JSON.stringify(data.user));

      if (data.user.email === "admin@quiz.com") {
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "index.html";
      }
    } else {
      errorMsg.textContent = data.message;
      errorMsg.style.visibility = 'visible';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    errorMsg.textContent = "Something went wrong. Try again later.";
    errorMsg.style.visibility = 'visible';
  });
});