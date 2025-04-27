console.log("index.js loaded.");

const userStatus = document.getElementById("user-status");
const userScoresDiv = document.getElementById("user-scores");
const user = JSON.parse(sessionStorage.getItem("loggedInUser"));

if (user) {
    userStatus.textContent = `Welcome, ${user.name}`;
} else {
    userStatus.textContent = "Welcome...";
}

document.addEventListener("DOMContentLoaded", function () {
    const quizzesContainer = document.getElementById("quizzes-container");

    let allQuizzes = [];

    fetch('http://localhost/quiz_web_app_backend/api/get_quizzes.php')
    .then(response => response.json())
    .then(response => {
        allQuizzes = response.data;

        if (!allQuizzes || allQuizzes.length === 0) {
            quizzesContainer.innerHTML = "<p>No quizzes available at the moment.</p>";
            return;
        }

        allQuizzes.forEach(quiz => {
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

        // Now fetch user scores
        if (user) {
            fetch(`http://localhost/quiz_web_app_backend/api/get_scores.php?user_id=${user.id}`)
            .then(response => response.json())
            .then(response => {
                const userScores = response.scores || [];

                userScoresDiv.innerHTML = "<h2>Your Scores:</h2><ul>";

                allQuizzes.forEach(quiz => {
                    const scoreEntry = userScores.find(s => s.quiz_id == quiz.id);

                    if (scoreEntry) {
                        userScoresDiv.innerHTML += `<li>${quiz.title}: ${scoreEntry.score}/${scoreEntry.total_questions}</li>`;
                    } else {
                        userScoresDiv.innerHTML += `<li>${quiz.title}: Not taken</li>`;
                    }
                });

                userScoresDiv.innerHTML += "</ul>";
            })
            .catch(error => {
                console.error("Error fetching user scores:", error);
            });
        }
    })
    .catch(error => {
        console.error("Error fetching quizzes:", error);
        quizzesContainer.innerHTML = "<p>Failed to load quizzes. Please try again later.</p>";
    });
});
