console.log("dashboard.js loaded");

document.addEventListener("DOMContentLoaded", function () {
    function updateDashboardStats() {
        updateTotalUsers();
        updateTotalQuizzes();
        updateAverageScore();
    }
    
    function updateTotalUsers() {
        fetch("http://localhost/quiz_web_app_backend/api/get_users.php")
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    document.getElementById("total-users").textContent = data.users.length;
                }
            })
            .catch(error => {
                console.error("Error fetching total users:", error);
            });
    }
    
    function updateTotalQuizzes() {
        fetch("http://localhost/quiz_web_app_backend/api/get_quizzes.php")
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    document.getElementById("total-quizzes").textContent = data.data.length;
                }
            })
            .catch(error => {
                console.error("Error fetching total quizzes:", error);
            });
    }
    
    function updateAverageScore() {
        fetch("http://localhost/quiz_web_app_backend/api/get_all_scores.php")
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    const scores = data.scores || [];
                    if (scores.length === 0) {
                        document.getElementById("average-score").textContent = "0%";
                        return;
                    }
    
                    let totalScore = 0;
                    let totalPossible = 0;
    
                    scores.forEach(score => {
                        if (score.total_questions && parseInt(score.total_questions) > 0) {
                            totalScore += parseInt(score.score);
                            totalPossible += parseInt(score.total_questions);
                        }
                    });
    
                    let average = 0;
                    if (totalPossible > 0) {
                        average = Math.round((totalScore / totalPossible) * 100);
                    }
    
                    document.getElementById("average-score").textContent = `${average}%`;
                }
            })
            .catch(error => {
                console.error("Error fetching average score:", error);
            });
    }
    
    




    const usersTableBody = document.getElementById("users-table-body");
    const quizzesTableBody = document.getElementById("quizzes-table-body");

    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        document.getElementById("admin-welcome").textContent = `Welcome, ${loggedInUser.name}`;
    }

    let allQuizzes = [];

    function fetchQuizzesAndUsers() {
        fetch("http://localhost/quiz_web_app_backend/api/get_quizzes.php")
            .then(response => response.json())
            .then(data => {
                allQuizzes = data.data;
                buildUserTableHeader();
                fetchUsers();
            })
            .catch(error => {
                console.error("Error fetching quizzes:", error);
            });
    }

    function buildUserTableHeader() {
        const usersTableHead = document.querySelector("#users-section thead tr");
        usersTableHead.innerHTML = `
            <th>#</th>
            <th>Email</th>
            ${allQuizzes.map(quiz => `<th>${quiz.title}</th>`).join('')}
            <th>Actions</th>
        `;
    }

    function fetchUsers() {
        fetch("http://localhost/quiz_web_app_backend/api/get_users.php")
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    usersTableBody.innerHTML = "";
                    data.users.forEach((user, index) => {
                        fetchUserScores(user, index);
                    });
                }
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
    }

    function fetchUserScores(user, index) {
        fetch(`http://localhost/quiz_web_app_backend/api/get_scores.php?user_id=${user.id}`)
            .then(response => response.json())
            .then(data => {
                const scores = data.scores || [];
                const row = document.createElement("tr");

                let scoresHtml = allQuizzes.map(quiz => {
                    const userScore = scores.find(score => score.quiz_id == quiz.id);
                    if (userScore) {
                        return `<td>${userScore.score}/${userScore.total_questions}</td>`;
                    } else {
                        return `<td>Not Taken</td>`;
                    }
                }).join('');

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.email}</td>
                    ${scoresHtml}
                    <td><button class="delete-btn" data-id="${user.id}">Delete</button></td>
                `;

                usersTableBody.appendChild(row);
                attachDeleteUserEvents();
            })
            .catch(error => {
                console.error("Error fetching user scores:", error);
            });
    }

    function attachDeleteUserEvents() {
        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach(button => {
            button.addEventListener("click", function () {
                const userId = this.getAttribute("data-id");
                if (confirm("Are you sure you want to delete this user?")) {
                    deleteUser(userId);
                }
            });
        });
    }

    function deleteUser(userId) {
        fetch("http://localhost/quiz_web_app_backend/api/delete_user.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("User deleted successfully!");
                fetchUsers();
            } else {
                alert("Failed to delete user.");
            }
        })
        .catch(error => {
            console.error("Error deleting user:", error);
        });
    }

    function fetchQuizzes() {
        fetch("http://localhost/quiz_web_app_backend/api/get_quizzes.php")
            .then(response => response.json())
            .then(data => {
                quizzesTableBody.innerHTML = "";
                if (data.status === "success") {
                    data.data.forEach((quiz, index) => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${quiz.title}</td>
                            <td>${quiz.description || "No description"}</td>
                            <td><button class="delete-btn" data-id="${quiz.id}">Delete</button></td>
                        `;
                        quizzesTableBody.appendChild(row);
                    });
                    attachDeleteQuizEvents();
                }
            })
            .catch(error => {
                console.error("Error fetching quizzes:", error);
            });
    }

    function attachDeleteQuizEvents() {
        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach(button => {
            button.addEventListener("click", function () {
                const quizId = this.getAttribute("data-id");
                if (confirm("Are you sure you want to delete this quiz?")) {
                    deleteQuiz(quizId);
                }
            });
        });
    }

    function deleteQuiz(quizId) {
        fetch("http://localhost/quiz_web_app_backend/api/delete_quiz.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quiz_id: quizId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Quiz deleted successfully!");
                fetchQuizzes();
            } else {
                alert("Failed to delete quiz.");
            }
        })
        .catch(error => {
            console.error("Error deleting quiz:", error);
        });
    }

    fetchQuizzesAndUsers();
    fetchQuizzes();
    updateDashboardStats();

});
