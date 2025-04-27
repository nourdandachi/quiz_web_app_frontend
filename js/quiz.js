const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
const quizName = user.selectedQuiz;
let currentQuestionIndex = 0;
let score = 0;

const quizTitle = document.querySelector(".quiz-title");
const questionNumber = document.querySelector(".question-number");
const questionText = document.getElementById("question-text");
const optionsContainer = document.querySelector(".answers");
const nextBtn = document.getElementById("next-btn");

quizTitle.textContent = quizName;

function loadQuestion() {
  const quizzes = JSON.parse(localStorage.getItem("quizzes"));
  const currentQuiz = quizzes[quizName];
  const q = currentQuiz[currentQuestionIndex];

  questionNumber.textContent = currentQuestionIndex + 1;
  questionText.textContent = q.question;

  optionsContainer.innerHTML = "";

  q.options.forEach((option, index) => {
    const div = document.createElement("div");
    div.classList.add("answer-option");
    div.innerHTML = `<span class="option-label">${String.fromCharCode(65 + index)}</span> ${option}`;

    div.addEventListener("click", () => {
      document.querySelectorAll(".answer-option").forEach(opt => opt.classList.remove("selected"));
      div.classList.add("selected");
      div.dataset.index = index;
    });

    optionsContainer.appendChild(div);
  });
}

nextBtn.addEventListener("click", () => {
  const selected = document.querySelector(".answer-option.selected");
  if (!selected) {
    alert("Please select an answer!");
    return;
  }

  const selectedIndex = parseInt(selected.dataset.index);

  const quizzes = JSON.parse(localStorage.getItem("quizzes"));
  const currentQuiz = quizzes[quizName];

  if (selectedIndex === currentQuiz[currentQuestionIndex].answer) {
    score++;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < currentQuiz.length) {
    loadQuestion();
  } else {
    user.scores = user.scores || {};
    user.scores[quizName] = {
      score: Math.round((score / currentQuiz.length) * 100),
      correct: score
    };

    sessionStorage.setItem("loggedInUser", JSON.stringify(user));

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map(u => u.email === user.email ? user : u);
    localStorage.setItem("users", JSON.stringify(users));

    window.location.href = "score.html";
  }
});

loadQuestion();
