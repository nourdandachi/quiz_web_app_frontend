console.log("score.js loaded.");

document.addEventListener("DOMContentLoaded", function () {
    const userStatus = document.getElementById("user-status");
    const scorePercent = document.getElementById("score-percent");
    const correctCount = document.getElementById("correct-count");
    const quizName = document.querySelector(".quiz-name");

    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    const selectedQuizId = sessionStorage.getItem("selectedQuizId");

    if (user) {
        userStatus.textContent = `Welcome, ${user.name}`;
    } else {
        userStatus.textContent = "Welcome";
    }

    if (user && selectedQuizId) {
        fetch(`http://localhost/quiz_web_app_backend/api/get_scores.php?user_id=${user.id}`)
            .then(response => response.json())
            .then(data => {
                console.log("Scores fetched:", data);

                if (data.status === "success") {
                    const scores = data.scores;
                    const quizScore = scores.find(score => score.quiz_id == selectedQuizId);

                    if (quizScore) {
                        const scoreValue = parseInt(quizScore.score);
                        const totalQuestions = parseInt(quizScore.total_questions);

                        if (!isNaN(scoreValue) && !isNaN(totalQuestions)) {
                            const percentage = Math.round((scoreValue / totalQuestions) * 100);
                            scorePercent.textContent = `${percentage}%`;
                            correctCount.textContent = `${scoreValue}/${totalQuestions}`;
                        } else {
                            scorePercent.textContent = "-%";
                            correctCount.textContent = "-/-";
                        }

                        if (quizName && quizScore.quiz_title) {
                            quizName.textContent = quizScore.quiz_title;
                        }
                    } else {
                        scorePercent.textContent = "-%";
                        correctCount.textContent = "-/-";
                        if (quizName) {
                            quizName.textContent = "Quiz";
                        }
                    }
                } else {
                    scorePercent.textContent = "-%";
                    correctCount.textContent = "-/-";
                    if (quizName) {
                        quizName.textContent = "Quiz";
                    }
                }
            })
            .catch(error => {
                console.error("Error fetching scores:", error);
                scorePercent.textContent = "-%";
                correctCount.textContent = "-/-";
                if (quizName) {
                    quizName.textContent = "Quiz";
                }
            });
    } else {
        scorePercent.textContent = "-%";
        correctCount.textContent = "-/-";
        if (quizName) {
            quizName.textContent = "Quiz";
        }
    }
});
