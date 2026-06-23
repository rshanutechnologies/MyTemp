// ===== QUIZ DATA =====
const quiz = [
  {
    q: "Q1. Petals enclose and protect the ______ parts of a flower.",
    a: "Reproductive",
    img: "../assets/images/reproductiveak.png",
  },
  {
    q: "Q2. Flowers in which both the male and the female parts are present on the same flower are called ______ flowers.",
    a: "Bisexual",
    img: "../assets/images/bisexualf.png",
  },
  {
    q: "Q3. The process by which the pollen grains get transferred from the anther to the stigma is called ______.",
    a: "Pollinating",
    img: "../assets/images/pollinating.png",
  },
  {
    q: "Q4. When a pollen grain falls on the stigma of a flower, it develops a long tube called the ______.",
    a: "Pollen tube",
    img: "../assets/images/Pollengrains.png",
  },
  {
    q: "Q5. The fertilised female reproductive cell or zygote develops into a ______.",
    a: "Seed",
    img: "../assets/images/seed.png",
  },
];

// ===== STATE =====
let index = 0;
let score = 0;
let answered = Array(quiz.length).fill(false);
let userAnswers = Array(quiz.length).fill("");

// DOM refs
const questionEl = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const checkBtn = document.getElementById("checkBtn");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const questionImg = document.getElementById("questionImage");

const blockedEvents = [
  "dragstart",
  "dragenter",
  "dragover",
  "dragleave",
  "drop",
];

blockedEvents.forEach((event) => {
  answerInput.addEventListener(event, (e) => {
    e.preventDefault();
  });
});

// ===== SPEECH (sounds) =====
function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

// ===== LOAD QUESTION =====
function load() {
  const current = quiz[index];
  questionEl.textContent = current.q;

  questionImg.src = current.img;
  questionImg.alt = "Illustration for question " + (index + 1);

  answerInput.value = userAnswers[index] || "";
  answerInput.disabled = answered[index];

  const hasText = answerInput.value.trim().length > 0;
  checkBtn.disabled = answered[index] || !hasText;

  prevBtn.disabled = index === 0;
  nextBtn.disabled = !answered[index];

if (!answered[index]) {
  answerInput.blur();
}
}

// ===== HANDLE INPUT =====
function handleInput() {
  let val = answerInput.value;

  // First letter uppercase, everything else lowercase
  if (val.length > 0) {
    val = val.toLowerCase();
    val = val.charAt(0).toUpperCase() + val.slice(1);
  }

  answerInput.value = val;
  userAnswers[index] = val;

  checkBtn.disabled = answered[index] || val.trim().length === 0;
}

// ===== CONFETTI =====
function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}

// ===== POPUP =====
function showPopup(type) {
  const popup = document.getElementById("popup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "popup " + type;
  popup.style.display = "flex";

  if (type === "correct") {
    launchConfetti();
    icon.textContent = "🥳";
    title.textContent = "Correct!";
    msg.textContent = "Great job!";
  } else {
    icon.textContent = "😒";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

// ===== CHECK ANSWER =====
function checkAnswer() {
  if (answered[index]) return;

  // Get user answer and capitalize first letter
let userAns = userAnswers[index].trim().toLowerCase();

// First letter uppercase, remaining letters lowercase
userAns = userAns.charAt(0).toUpperCase() + userAns.slice(1);

const correctAns = quiz[index].a.trim();

if (userAns === correctAns) {
    showPopup("correct");
    speak("Correct");

    answered[index] = true;
    score++;
    answerInput.disabled = true;
    checkBtn.disabled = true;
    nextBtn.disabled = false;

    if (index === quiz.length - 1) {
      setTimeout(() => {
        document.getElementById("final").style.display = "block";
        document.getElementById("score").textContent = `Your Score: ${score}/5`;
        launchConfetti();
        prevBtn.disabled = true;
        nextBtn.disabled = true;
      }, 1600);
    }
  } else {
    showPopup("wrong");
    speak("wrong");
    answerInput.value="";
    checkBtn.disabled=true;
  }
}

// ===== NAVIGATION =====
function goNext() {
  if (index < quiz.length - 1) {
    index++;
    load();
  }
}

function goPrev() {
  if (index > 0) {
    index--;
    load();
  }
}

// ===== PLAY AGAIN =====
function playAgain() {
  location.reload();
}

// ===== EVENT LISTENERS =====
answerInput.addEventListener("input", handleInput);
checkBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", goNext);
prevBtn.addEventListener("click", goPrev);

answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !checkBtn.disabled) {
    checkAnswer();
  }
});

// ===== INIT =====
load();

// Expose for onclick
window.playAgain = playAgain;
