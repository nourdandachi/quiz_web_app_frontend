if (!localStorage.getItem("quizzes")) {
  const quizzes = {
    "Intro to CS": [
      {
        question: "Which of the following is NOT a programming language?",
        options: ["Python", "Java", "HTML", "C++"],
        answer: 2
      },
      {
        question: "What does CPU stand for?",
        options: ["Central Programming Unit", "Central Processing Unit", "Computer Personal Unit", "Core Processor Unit"],
        answer: 1
      },
      {
        question: "Which one is a type of loop in programming?",
        options: ["circle()", "if-else", "for", "call()"],
        answer: 2
      }
    ],
    "Data Structures": [
      {
        question: "Which data structure uses LIFO?",
        options: ["Queue", "Tree", "Array", "Stack"],
        answer: 3
      },
      {
        question: "What is the time complexity of binary search?",
        options: ["O(log n)", "O(n^2)", "O(n)", "O(1)"],
        answer: 0
      },
      {
        question: "Which one is not a linear data structure?",
        options: ["Stack", "Queue", "Graph", "Array"],
        answer: 2
      }
    ],
    "Algorithms & Analysis": [
      {
        question: "Which algorithm is used for sorting?",
        options: ["Binary Search", "Bubble Sort", "Linear Search", "Stack"],
        answer: 1
      },
      {
        question: "Big O of nested loop O(n) inside O(n)?",
        options: ["O(n)", "O(log n)", "O(n^2)", "O(n log n)"],
        answer: 2
      },
      {
        question: "Which algorithm is used to find shortest path?",
        options: ["Binary Sort", "Bubble Sort", "Dijkstra", "Stack"],
        answer: 2
      }
    ]
  };

  localStorage.setItem("quizzes", JSON.stringify(quizzes));
}
