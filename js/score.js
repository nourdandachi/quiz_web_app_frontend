const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
const userStatus = document.getElementById("user-status");
if (user && userStatus) {
  userStatus.textContent = `Welcome, ${user.name}`;
} else if (userStatus) {
  userStatus.textContent = "Welcome, Guest";
}

if (!user || !user.selectedQuiz || !user.scores || !user.scores[user.selectedQuiz]) {
  alert("Score data not found.");
  window.location.href = "index.html";
}

const quizName = user.selectedQuiz;
const result = user.scores[quizName];

document.querySelector(".quiz-name").textContent = quizName;
document.getElementById("score-percent").textContent = `${result.score}%`;
document.getElementById("correct-count").textContent = result.correct;
