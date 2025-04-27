const registerForm = document.getElementById("register-form");
const errorMsg = document.getElementById("error-msg");

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    errorMsg.textContent = "Passwords do not match!";
    errorMsg.style.visibility = 'visible';
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(user => user.email === email)) {
    errorMsg.textContent = "This email is already registered.";
    errorMsg.style.visibility = 'visible';
    return;
  }

  const newUser = {
    name,
    email,
    password,
    scores: {}
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  window.location.href = "login.html";
});
