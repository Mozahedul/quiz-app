const quizData = [
  {
    question: "What does DOM stand for in JavaScript?",
    options: [
      "Document Object Model",
      "Data Object Model",
      "Display Object Model",
      "Digital Object Model",
    ],
    correct: 0,
    duration: 25,
  },
  {
    question:
      "Which method is used to add an element to the end of an array in JavaScript?",
    options: ["pop()", "shift()", "push()", "unshift()"],
    correct: 2,
    duration: 25,
  },
  {
    question:
      "What is the output of the following code: console.log(typeof NaN);",
    options: ["number", "string", "undefined", "object"],
    correct: 3,
    duration: 65,
  },
  {
    question: "Which of the following is NOT a JavaScript data type?",
    options: ["String", "Character", "Number", "Boolean"],
    correct: 1,
    duration: 72,
  },
];

const questions = [...quizData].sort(() => Math.random() - 0.5);
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const timerEl = document.getElementById("timer");
const resultEl = document.getElementById("result");
const quizBox = document.getElementById("quiz-box");

function loadQuestion() {
  clearInterval(timer);
  const current = quizData[currentQuestion];
  timeLeft = current.duration;
  updateTimer();
  timer = setInterval(countdown, 1000);

  // show time left
  // quizData.forEach((option,index) => {
  //   timeLeft = option.duration;
  // });

  timerEl.style.display = "block";
  nextBtn.style.display = "none";
  optionsEl.style.display = "block";
  questionEl.style.display = "block";
  const q = questions[currentQuestion];
  questionEl.textContent = `Q${currentQuestion + 1}. ${q.question}`;

  // Remove the previous options before loading new ones
  optionsEl.innerHTML = "";

  // Loop all the options and create buttons for each, adding event listeners to handle answer selection
  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.addEventListener("click", () => selectAnswer(index, true));
    btn.classList.add("option-btn");
    const opationsLetter =
      index === 0 ? "A" : index === 1 ? "B" : index === 2 ? "C" : "D";
    btn.innerHTML = `
    <span class="letter">${opationsLetter}</span> 
    <span class="option-text">${option}</span>
    `;
    optionsEl.appendChild(btn);

    nextBtn.style.display = "none";
  });
}

function countdown() {
  timeLeft--;
  updateTimer();

  if (timeLeft === 0) {
    clearInterval(timer);
    selectAnswer(questions[currentQuestion]?.correct, false);
  }
}

// format time
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins === 0) return `${secs} Sec`;
  if (secs === 0) return `${mins} Min`;
  return `${mins} Min ${secs} Sec`;
}

function updateTimer() {
  timerEl.textContent =
    timeLeft > 0 ? `Time Left: ${formatTime(timeLeft)}` : "Time's up!";
  timerEl.style.width = "50%";
  timerEl.style.margin = "10px auto";
  timerEl.style.borderRadius = "40px";
  timerEl.style.padding = "8px 0";

  timerEl.style.backgroundColor = timeLeft <= 15 ? "#e74c3c" : "#141414";
}

function selectAnswer(index, shouldScore) {
  clearInterval(timer);
  const q = questions[currentQuestion];
  const buttons = document.querySelectorAll(".option-btn");

  // After clicking on any of the answer options, disable all buttons and show correct/incorrect feedback
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
  });

  if (index === q.correct) {
    shouldScore && score++;
    buttons[index].classList.add("correct");
  } else {
    buttons[index].classList.add("incorrect");
    buttons[q.correct].classList.add("correct");
  }

  nextBtn.style.display = "inline-block";
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  clearInterval(timer);
  timerEl.style.display = "none";
  nextBtn.style.display = "none";
  optionsEl.style.display = "none";
  questionEl.style.display = "none";
  quizBox.style.padding = "30px";
  const highScore = localStorage.getItem("quizHighScore") || 0;

  const isNew = score > highScore;

  if (isNew) {
    localStorage.setItem("quizHighScore", score);
  }

  resultEl.innerHTML = `
    <h2 id="hurray">👏 Hurray!!! You completed the quiz!</h2>
    <p id="score">Your Score: ${score} out of ${questions.length}</p>
    <p id="highest-score">Highest Score: ${Math.max(score, highScore)}</p>
    ${isNew ? "<p>Congratulations! You set a new high score!</p>" : ""}
    <button id="retake-quiz" onclick="resetQuiz()">Retake Quiz</button>
  `;
}

function resetQuiz() {
  score = 0;
  currentQuestion = 0;
  resultEl.innerHTML = "";
  loadQuestion();
}

loadQuestion();
