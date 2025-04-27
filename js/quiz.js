console.log("quiz.js loaded.");

document.addEventListener("DOMContentLoaded", function () {
    const questionText = document.getElementById("question-text");
    const options = document.querySelectorAll(".answer-option");
    const nextButton = document.getElementById("next-btn");
    const questionNumber = document.querySelector(".question-number");

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedAnswer = "";

    const selectedQuizId = sessionStorage.getItem("selectedQuizId");

    if (!selectedQuizId) {
        alert("No quiz selected. Redirecting to home.");
        window.location.href = "index.html";
    }

    fetch(`http://localhost/quiz_web_app_backend/api/get_questions.php?quiz_id=${selectedQuizId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Server returned:", data);

            if (data.status === "success" && data.questions.length > 0) {
                questions = data.questions;
                loadQuestion();
            } else {
                questionText.textContent = "No questions found for this quiz.";
                nextButton.style.display = "none";
            }
        })
        .catch(error => {
            console.error("Error fetching questions:", error);
            questionText.textContent = "Failed to load questions.";
            nextButton.style.display = "none";
        });

    function loadQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionText.innerHTML = `<em>${currentQuestion.question_text}</em>`;
        options[0].innerHTML = `<span class="option-label">A</span> ${currentQuestion.option_a}`;
        options[1].innerHTML = `<span class="option-label">B</span> ${currentQuestion.option_b}`;
        options[2].innerHTML = `<span class="option-label">C</span> ${currentQuestion.option_c}`;
        options[3].innerHTML = `<span class="option-label">D</span> ${currentQuestion.option_d}`;
        questionNumber.textContent = currentQuestionIndex + 1;
    }

    options.forEach((option, index) => {
        option.addEventListener("click", function () {
            options.forEach(o => o.classList.remove("selected"));
            this.classList.add("selected");

            if (index === 0) selectedAnswer = "A";
            else if (index === 1) selectedAnswer = "B";
            else if (index === 2) selectedAnswer = "C";
            else if (index === 3) selectedAnswer = "D";
        });
    });

    nextButton.addEventListener("click", function () {
        if (selectedAnswer === "") {
            alert("Please select an answer before moving on.");
            return;
        }

        const correctOption = questions[currentQuestionIndex].correct_option;
        if (selectedAnswer === correctOption) {
            score++;
        }

        selectedAnswer = "";
        options.forEach(o => o.classList.remove("selected"));

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            sessionStorage.setItem("quizScore", score);
            sessionStorage.setItem("totalQuestions", questions.length);
            window.location.href = "score.html";
        }
    });
});
