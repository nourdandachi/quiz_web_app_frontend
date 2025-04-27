console.log("index.js loaded.");
const userStatus = document.getElementById("user-status");
const user = JSON.parse(sessionStorage.getItem("loggedInUser"));

if (user) {
    userStatus.textContent = `Welcome, ${user.name}`;
} else {
    userStatus.textContent = "Welcome...";
}


document.addEventListener("DOMContentLoaded", function () {
    const quizzesContainer = document.getElementById("quizzes-container");

    fetch('http://localhost/quiz_web_app_backend/api/get_quizzes.php')
    .then(response => response.json())
    .then(response => {
        const quizzes = response.data;

        if (!quizzes || quizzes.length === 0) {
            quizzesContainer.innerHTML = "<p>No quizzes available at the moment.</p>";
            return;
        }

        quizzes.forEach(quiz => {
            const quizCard = document.createElement("div");
            quizCard.classList.add("quiz-box");

            quizCard.innerHTML = `
                <h2>${quiz.title}</h2>
                <p>${quiz.description}</p>
                <button class="start-btn" data-quiz-id="${quiz.id}">Start</button>
            `;

            quizzesContainer.appendChild(quizCard);
        });

        const startButtons = document.querySelectorAll(".start-btn");
        startButtons.forEach(button => {
            button.addEventListener("click", function () {
                const quizId = this.getAttribute("data-quiz-id");
                sessionStorage.setItem("selectedQuizId", quizId);
                window.location.href = "quiz.html";
            });
        });
    })
    .catch(error => {
        console.error("Error fetching quizzes:", error);
        quizzesContainer.innerHTML = "<p>Failed to load quizzes. Please try again later.</p>";
    });

});
