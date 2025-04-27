const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
const userStatus = document.getElementById("user-status");
const navLinks = document.getElementById("nav-links");

if (user) {
  userStatus.textContent = `Welcome, ${user.name}`;

  document.getElementById("login-link")?.remove();
  document.getElementById("register-link")?.remove();

  const logoutLink = document.createElement("a");
  logoutLink.href = "login.html";
  logoutLink.textContent = "Logout";
  navLinks.appendChild(logoutLink);

  if (user.email === "admin@quiz.com") {
    const dashboardLink = document.createElement("a");
    dashboardLink.href = "dashboard.html";
    dashboardLink.textContent = "Dashboard";
    navLinks.appendChild(dashboardLink);
  }
} else {
  scoresDiv= document.querySelector(".user-scores");
  userStatus.textContent = "Welcome, Guest";
  scoresDiv.style.visibility= "hidden";

}

if (user && user.scores) {
  const quizOrder = ["Intro to CS", "Data Structures", "Algorithms & Analysis"];
  const scoresDiv = document.getElementById("user-scores");
  
  let scoreHTML = quizOrder.map(quiz => {
    const data = user.scores[quiz];
    return `<p>${quiz}: ${data ? data.score + "%" : "Not taken"}</p>`;
  }).join("");
  
  scoresDiv.innerHTML = `
    <h3>Your Quiz Results:</h3>
    ${scoreHTML}
  `;
  
}


const startButtons = document.querySelectorAll(".start-btn");
const quizTitles = document.querySelectorAll(".quiz-box .quiz-title");

startButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const quizName = quizTitles[index].textContent.trim();

    const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (!currentUser) {
      alert("You must be logged in to start a quiz.");
      return;
    }

    currentUser.selectedQuiz = quizName;
sessionStorage.setItem("loggedInUser", JSON.stringify(currentUser));



    window.location.href = "quiz.html";
  });
});
