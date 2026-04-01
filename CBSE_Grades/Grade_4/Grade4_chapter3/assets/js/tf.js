const questions = [
  {
    q: "1. There is less oxygen in high altitudes.",
    a: true,
    img: "../images/TF-1.png",
  },
  {
    q: "2. Chipmunks and bears hibernate during cold seasons.",
    a: true,
    img: "../images/TF-2.png",
  },
  {
    q: "3. Sharks and fishes move with the help of their flippers.",
    a: false,
    img: "../images/TF-3.png",
  },
  {
    q: "4. Desert animals have adaptive features like storing water in their bodies.",
    a: true,
    img: "../images/TF-4.png",
  },
  {
    q: "5. Polar bears sleep during summer to save energy.",
    a: false,
    img: "../images/TF-5.png",
  },
];

let currentIndex = 0;
let score = 0;

const elements = {
  question: document.getElementById("question"),
  img: document.getElementById("questionImg"),
  trueBtn: document.getElementById("trueBtn"),
  falseBtn: document.getElementById("falseBtn"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  dropBox: document.getElementById("dropBox"),
};

const finalPopup = document.getElementById("finalPopup");

// Hide final popup on load
finalPopup.style.display = "none";

// ─── Speech ───────────────────────────────────────────────
function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  speechSynthesis.speak(msg);
}

// ─── Confetti ─────────────────────────────────────────────
function smallConfetti() {
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  const duration = 500;
  const end = Date.now() + duration;
  (function frame() {
    confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// ─── Render Question ──────────────────────────────────────
function renderQuestion() {
  const q = questions[currentIndex];

  elements.question.textContent = q.q;
  elements.img.src = q.img;

  elements.prevBtn.disabled = currentIndex === 0;
  elements.nextBtn.disabled = true;

  elements.trueBtn.style.opacity = "1";
  elements.falseBtn.style.opacity = "1";
  elements.trueBtn.disabled = false;
  elements.falseBtn.disabled = false;

  elements.dropBox.textContent = "";
  elements.dropBox.classList.remove("filled");

  // Restore previous answer if exists
  if (q.userAnswer !== undefined) {
    elements.dropBox.textContent = q.userAnswer ? "TRUE" : "FALSE";
    elements.dropBox.classList.add("filled");

    elements.trueBtn.disabled = true;
    elements.falseBtn.disabled = true;

    if (q.a) {
      elements.trueBtn.style.opacity = "1";
      elements.falseBtn.style.opacity = ".5";
    } else {
      elements.falseBtn.style.opacity = "1";
      elements.trueBtn.style.opacity = ".5";
    }

    elements.nextBtn.disabled = false;
  }
}

// ─── Handle Answer ────────────────────────────────────────
function handleAnswer(selected) {
  const q = questions[currentIndex];

  if (q.userAnswer !== undefined) return;

  if (selected === q.a) {
    score++;
    q.userAnswer = selected;

    elements.dropBox.textContent = q.a ? "TRUE" : "FALSE";
    elements.dropBox.classList.add("filled");

    elements.trueBtn.disabled = true;
    elements.falseBtn.disabled = true;

    if (q.a) {
      elements.trueBtn.style.opacity = "1";
      elements.falseBtn.style.opacity = ".5";
    } else {
      elements.falseBtn.style.opacity = "1";
      elements.trueBtn.style.opacity = ".5";
    }

    elements.nextBtn.disabled = false;

    speak("Correct");
    showPopup(true);
    smallConfetti();

    // ✅ Show final popup only on last question
    if (currentIndex === questions.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    speak("Wrong");
    showPopup(false);
  }
}

// ─── Answer Popup ─────────────────────────────────────────
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉😊";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "🥲💭";
    title.textContent = "Oops!";
    msg.textContent = "Try again, you can do it!";
  }

  setTimeout(() => (popup.style.display = "none"), 1400);
}

// ─── Final Popup ──────────────────────────────────────────
function showFinal() {
  document.getElementById("answerPopup").style.display = "none";
  // ✅ Use questions.length NOT quizData.length
  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${questions.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
  finalPopup.style.display = "flex";
  bigConfetti();
}

// ─── Restart ──────────────────────────────────────────────
function restartQuiz() {
  // ✅ Use correct TF variables NOT mcq.js variables
  currentIndex = 0;
  score = 0;

  // ✅ Reset userAnswer on every question
  questions.forEach((q) => delete q.userAnswer);

  finalPopup.style.display = "none";
  renderQuestion();
}

// ─── Navigation ───────────────────────────────────────────
elements.trueBtn.onclick = () => handleAnswer(true);
elements.falseBtn.onclick = () => handleAnswer(false);

elements.prevBtn.onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
};

elements.nextBtn.onclick = () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
};

// ─── Init ─────────────────────────────────────────────────
renderQuestion();