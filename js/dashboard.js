const admin = JSON.parse(sessionStorage.getItem("loggedInUser"));
document.getElementById("admin-welcome").textContent = `Welcome, ${admin?.name || "Admin"}`;

let users = JSON.parse(localStorage.getItem("users")) || [];
const quizzes = ["Intro to CS", "Data Structures", "Algorithms & Analysis"];
const totalQuizzes = quizzes.length;

document.getElementById("total-users").textContent = users.length;
document.getElementById("total-quizzes").textContent = totalQuizzes;

const tbody = document.getElementById("users-table-body");
tbody.innerHTML = "";

let totalScoreSum = 0;
let scoreCount = 0;

users.forEach((user, index) => {
  const tr = document.createElement("tr");
  const scores = user.scores || {};

  const quizScores = quizzes.map(q => {
    if (scores[q]) {
      totalScoreSum += scores[q].score;
      scoreCount++;
      return `${scores[q].score}%`;
    }
    return "-";
  });

  tr.innerHTML = `
    <td>${index + 1}</td>
    <td>${user.email}</td>
    <td>${quizScores[0]}</td>
    <td>${quizScores[1]}</td>
    <td>${quizScores[2]}</td>
    <td><button class="delete-btn" data-index="${index}">Delete</button></td>
  `;

  tbody.appendChild(tr);
});

const avgScore = scoreCount ? Math.round(totalScoreSum / scoreCount) : 0;
document.getElementById("average-score").textContent = `${avgScore}%`;

document.querySelectorAll(".delete-btn").forEach(button => {
  button.addEventListener("click", () => {
    const index = parseInt(button.dataset.index);
    const confirmed = confirm("Are you sure you want to delete this user?");

    if (confirmed) {
      users.splice(index, 1);
      localStorage.setItem("users", JSON.stringify(users));
      location.reload();
    }
  });
});


const quizData = JSON.parse(localStorage.getItem("quizzes")) || {};
const quizSelector = document.getElementById("quiz-selector");
const questionNumberSelect = document.getElementById("question-number");
const questionInput = document.getElementById("question-text");
const optionInputs = document.querySelectorAll(".option-input");
const correctInput = document.getElementById("correct-answer");
const saveBtn = document.getElementById("save-quiz-btn");

function populateQuestionNumbers(quizName) {
  const questions = quizData[quizName];
  questionNumberSelect.innerHTML = "";

  questions.forEach((_, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = `Question ${index + 1}`;
    questionNumberSelect.appendChild(opt);
  });

  loadQuestionToEditor(quizName, 0);
}

function loadQuestionToEditor(quizName, index) {
  const q = quizData[quizName][index];
  questionInput.value = q.question;
  q.options.forEach((text, i) => {
    optionInputs[i].value = text;
  });
  correctInput.value = q.answer;
}

saveBtn.addEventListener("click", () => {
  const quizName = quizSelector.value;
  const questionIndex = parseInt(questionNumberSelect.value);

  const updatedQuestion = {
    question: questionInput.value.trim(),
    options: Array.from(optionInputs).map(i => i.value.trim()),
    answer: parseInt(correctInput.value)
  };

  if (
    !updatedQuestion.question ||
    updatedQuestion.options.length !== 4 ||
    updatedQuestion.options.some(opt => !opt) ||
    isNaN(updatedQuestion.answer) ||
    updatedQuestion.answer < 0 ||
    updatedQuestion.answer > 3
  ) {
    alert("Please fill all fields correctly.");
    return;
  }

  quizData[quizName][questionIndex] = updatedQuestion;
  localStorage.setItem("quizzes", JSON.stringify(quizData));
  alert("Question updated successfully!");
});

quizSelector.addEventListener("change", () => {
  populateQuestionNumbers(quizSelector.value);
});

questionNumberSelect.addEventListener("change", () => {
  loadQuestionToEditor(quizSelector.value, parseInt(questionNumberSelect.value));
});
populateQuestionNumbers(quizSelector.value);
