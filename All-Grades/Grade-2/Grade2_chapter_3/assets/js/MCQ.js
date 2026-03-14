const questions = [
  {
    img: "../assets/images/C-1.png",
    q: "The famous festival celebrated by the people of Hyderabad is __________ .",
    options: [" Bonalu ", " Visakha Utsav ", " Chandanaotsavam "],
    correct: 0,
  },
  {
    img: "../assets/images/C-2.png",
    q: "The people of Karnataka are called ___________.",
    options: ["Hyderabadis ", "Kannadigas ", " Delhiites "],
    correct: 1,
  },
  {
    img: "../assets/images/C-3.png",
    q: "Delhi is situated along the banks of River ___________.",
    options: [" Ganga", " Kaveri", " Yamuna"],
    correct: 2,
  },
  {
    img: "../assets/images/C-4.png",
    q: "The Charminar is located in . ",
    options: [" Kolkata", " Mumbai", "Hyderabad"],
    correct: 2,
  },
  {
    img: "../assets/images/C-5.png",
    q: "_________ has many beaches.",
    options: ["Delhi", "Kolkata", "Visakhapatnam"],
    correct: 2,
  },
];

let index = 0;
let answered = Array(questions.length).fill(false);
let correctCount = 0;

const qEl = document.getElementById("question");
const questionImage = document.getElementById("questionImage");
const progress = document.getElementById("progress");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const popup = document.getElementById("feedbackPopup");
const circle = document.getElementById("feedbackCircle");
const flyingTick = document.getElementById("flyingTick");
function speak(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

/* ✅ only 3 options now */
function resetOptions() {
  for (let i = 0; i < 3; i++) {
    const btn = document.getElementById("opt" + i);
    btn.disabled = false;
    btn.classList.remove("correct-border");
  }
}

function loadQuestion() {
  resetOptions();
  const q = questions[index];
  qEl.textContent = q.q;
  questionImage.src = q.img;

  q.options.forEach((t, i) => {
    document.getElementById("opt" + i).children[1].textContent = t;
  });

  nextBtn.disabled = !answered[index];
  prevBtn.disabled = index === 0;

  if (answered[index]) lockWrongOptions();
}

/* ✅ only 3 options now */
function lockWrongOptions() {
  const c = questions[index].correct;
  for (let i = 0; i < 3; i++) {
    if (i !== c) document.getElementById("opt" + i).disabled = true;
  }
  document.getElementById("opt" + c).classList.add("correct-border");
}

function showFeedback(type) {
  popup.style.display = "flex";
  circle.className = "feedback-circle " + type;
  circle.innerHTML = type === "correct" ? "✔" : "✖";
}

function hideFeedback() {
  popup.style.display = "none";
}

function flyTickToProgress(targetEl) {
  const from = circle.getBoundingClientRect();
  const to = targetEl.getBoundingClientRect();

  flyingTick.style.opacity = "1";
  flyingTick.style.left = from.left + from.width / 2 + "px";
  flyingTick.style.top = from.top + from.height / 2 + "px";

  flyingTick.getBoundingClientRect();

  flyingTick.style.transition = "all 0.9s ease";
  flyingTick.style.left = to.left + to.width / 2 + "px";
  flyingTick.style.top = to.top + to.height / 2 + "px";

  setTimeout(() => {
    flyingTick.style.opacity = "0";
    flyingTick.style.transition = "none";
  }, 950);
}

function checkAnswer(i) {
  if (answered[index]) return;

  if (i === questions[index].correct) {
    answered[index] = true;
    correctCount++;

    speak("Correct");

    const targetCircle = progress.children[index];
    showFeedback("correct");

    setTimeout(() => flyTickToProgress(targetCircle), 200);

    setTimeout(() => {
      targetCircle.classList.add("active");
      targetCircle.textContent = "✔";

      lockWrongOptions();
      nextBtn.disabled = false;
      hideFeedback();

      if (correctCount === questions.length) {
        setTimeout(() => {
          document.getElementById("finalScoreText").textContent =
            `Score: ${correctCount} / ${questions.length}`;
          document.getElementById("finalStars").textContent = "⭐".repeat(
            correctCount,
          );
          document.getElementById("finalPopup").style.display = "flex";
          speak("Congratulations");
        }, 600);
      }
    }, 950);
  } else {
    speak("Try again");
    showFeedback("wrong");
    setTimeout(() => hideFeedback(), 900);
  }
}

function nextQuestion() {
  if (index < questions.length - 1) {
    index++;
    loadQuestion();
  }
}
function prevQuestion() {
  if (index > 0) {
    index--;
    loadQuestion();
  }
}

function restartQuiz() {
  index = 0;
  correctCount = 0;
  answered.fill(false);

  progress.innerHTML = "";
  document.getElementById("finalPopup").style.display = "none";
  init();
}

function init() {
  progress.innerHTML = "";
  for (let i = 0; i < questions.length; i++) {
    const c = document.createElement("div");
    c.className = "circle";
    c.textContent = i + 1;
    progress.appendChild(c);
  }
  loadQuestion();
}
init();
