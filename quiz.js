const menuList = [
  {
    name: "HTML",
    url: "https://gist.githubusercontent.com/Mozahedul/23b62956155e9d8fdcebb6680d43393f/raw/html.json",
  },
  {
    name: "CSS",
    url: "https://gist.githubusercontent.com/Mozahedul/2c540573bfc92e92598a0b184eb28c51/raw/css.json",
  },
  {
    name: "JavaScript",
    url: "https://gist.githubusercontent.com/Mozahedul/a741404beafa87f1d8b21c8121a50ae2/raw/quiz.json",
  },
  {
    name: "NodeJS",
    url: "https://gist.githubusercontent.com/Mozahedul/6dda022d2314f30d22498a286b227467/raw/nodejs.json",
  },
  {
    name: "ExpressJS",
    url: "https://gist.githubusercontent.com/Mozahedul/95de74139dd79e84eb4146045daf30e8/raw/expressjs.json",
  },
  {
    name: "MongoDB",
    url: "https://gist.githubusercontent.com/Mozahedul/d5d674b7b36da86f32a0ae65ccc2b30c/raw/mongodb.json",
  },
];

// Fetch data from API
const fetchQuizData = async url => {
  try {
    const response = await fetch(url, {
      cache: "no-cache",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching quiz data:", error.message);
  }
};

const quizData = await fetchQuizData(menuList[2].url);

let questions = [...quizData].sort(() => Math.random() - 0.5);
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

// Load Quiz menu
function loadMenu() {
  // Load menu list
  const quizMenu = document.getElementById("quizMenu");
  quizMenu.innerHTML = "";

  menuList.forEach(list => {
    const menuBtn = document.createElement("button");
    menuBtn.classList.add("menu-btn");
    menuBtn.textContent = list.name;
    quizMenu.appendChild(menuBtn);

    menuBtn.addEventListener("click", async () => {
      questions = await fetchQuizData(list.url);

      if (!questions || questions.length === 0) return;

      loadQuizTitle(list.name);

      document.querySelector(".menu-btn.active")?.classList.remove("active");
      menuBtn.classList.add("active");

      currentQuestion = 0;
      score = 0;
      loadQuestion();
    });

    if (list.name === "JavaScript") {
      menuBtn.classList.add("active");
    }
  });
}

// ✅ Load quiz title
function loadQuizTitle(title) {
  const quizMenu = document.getElementById("quizMenu");
  // Remove existing h1 if it exists
  if (quizMenu?.nextElementSibling?.tagName === "H1") {
    quizMenu.nextElementSibling.remove();
  }
  const quizTitleElm = document.createElement("h1");
  quizTitleElm.classList.add("quizTitle");
  quizTitleElm.textContent = `${title} Quizzes`;
  quizMenu.after(quizTitleElm);
}

loadQuizTitle("JavaScript");

// Load questions
function loadQuestion() {
  clearInterval(timer);
  const q = questions[currentQuestion];
  timeLeft = q.duration;
  updateTimer();
  timer = setInterval(countdown, 1000);

  timerEl.style.display = "block";
  nextBtn.style.display = "none";
  optionsEl.style.display = "block";
  questionEl.style.display = "block";

  questionEl.textContent = `Q${currentQuestion + 1}. ${q.question}`;

  // Remove the previous options before loading new ones
  optionsEl.innerHTML = "";

  // Loop all the options and create buttons for each, adding event listeners to handle answer selection
  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.addEventListener("click", () => selectAnswer(index, true));
    btn.classList.add("option-btn");
    const opationsLetter = ["A", "B", "C", "D"][index];
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
  timerEl.innerHTML =
    timeLeft > 0
      ? `<strong>⌚ Time Left:</strong> ${formatTime(timeLeft)}`
      : "😢 Time's up!";
  timerEl.style.display = "inline-block";
  timerEl.style.borderRadius = "40px";
  timerEl.style.padding = "5px 15px";

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

  // Quiz completion page layout
  resultEl.innerHTML = `
    <h2 id="hurray">👏 Hurray!!! You completed the quiz!</h2>
    <p id="score"><strong>Your Score:</strong> ${score} out of ${questions.length}</p>
    <p id="highest-score"><strong>Highest Score:</strong> ${Math.max(score, highScore)}</p>
    ${isNew ? "<p><strong>Congratulations!</strong> You set a new high score!</p>" : ""}
    <button id="retake-quiz">Retake Quiz</button>
  `;

  // After quiz completion, retake button will be pressed
  const retakeQuizBtn = document.getElementById("retake-quiz");
  retakeQuizBtn?.addEventListener("click", () => resetQuiz());
}

function resetQuiz() {
  score = 0;
  currentQuestion = 0;
  resultEl.innerHTML = "";
  loadQuestion();
}

loadMenu();
loadQuestion();
