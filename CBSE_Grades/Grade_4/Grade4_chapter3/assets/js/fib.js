const questions = [
  {
    q: "1. Aerial animals spend most of their time in ___________________.",
    a: ["air"],
    img: "../images/FIB-1.png",
  },
  {
    q: "2. The webbed feet of frogs and ducks help them to ____________________.",
    a: ["swim"],
    img: "../images/FIB-2.png",
  },
  {
    q: "3. Whales, dolphins and turtles move with the help of their ____________.",
    a: ["flippers"],
    img: "../images/FIB-3.png",
  },
  {
    q: "4. ____________________ animals have wings to fly in air.",
    a: ["aerial"],
    img: "../images/FIB-4.png",
  },
  {
    q: "5. The ___________ of animals like porcupine and hedgehog protect them.",
    a: ["spines"],
    img: "../images/FIB-5.png",
  },
];

let index = 0;
let score = 0;

const questionText = document.getElementById("questionText");
const image = document.getElementById("questionImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const inputsRow = document.getElementById("inputsContainer");
const finalPopup = document.getElementById("finalPopup");

// Hide final popup on load
finalPopup.style.display = "none";

const userAnswers = questions.map((q) => ({
  used: [],
  boxes: q.a.map(() => ({ value: "", correct: false })),
}));

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

// ─── Load Question ────────────────────────────────────────
function loadQuestion() {
  const q = questions[index];

  questionText.innerText = q.q;
  image.src = q.img;

  prevBtn.disabled = index === 0;
  nextBtn.disabled = !userAnswers[index].boxes.every((b) => b.correct);

  inputsRow.innerHTML = "";

  q.a.forEach((_, i) => {
    const box = document.createElement("div");
    box.className = "input-box";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type here...";
    input.value = userAnswers[index].boxes[i].value;

    const btn = document.createElement("button");
    btn.className = "check-btn";
    btn.textContent = "Check";
    btn.disabled = input.value.trim() === "";

    input.addEventListener("input", () => {
      btn.disabled = input.value.trim() === "";
    });

    if (userAnswers[index].boxes[i].correct) {
      box.classList.add("correct");
      input.disabled = true;
      btn.disabled = true;
    }

    btn.onclick = () => checkAnswer(input, btn, box, i);

    box.append(input, btn);
    inputsRow.appendChild(box);
  });
}

// ─── Check Answer ─────────────────────────────────────────
function checkAnswer(input, btn, box, i) {
  const value = input.value.trim().toLowerCase();
  const answers = questions[index].a;
  const state = userAnswers[index];

  if (answers.includes(value) && !state.used.includes(value)) {
    box.classList.add("correct");
    input.disabled = true;
    btn.disabled = true;

    state.used.push(value);
    state.boxes[i] = { value, correct: true };

    speak("Correct");
    smallConfetti();
    showPopup(true);
  } else {
    input.value = "";
    btn.disabled = true;
    speak("Wrong");
    showPopup(false);
  }

  checkAllAnswered();
}

// ─── Check All Answered ───────────────────────────────────
function checkAllAnswered() {
  const done = userAnswers[index].boxes.every((b) => b.correct);
  nextBtn.disabled = !done;

  if (done && !userAnswers[index].scored) {
    score++;
    userAnswers[index].scored = true;

    // ✅ Show final popup only on last question
    if (index === questions.length - 1) {
      setTimeout(showFinal, 1600);
    }
  }
}

// ─── Navigation ───────────────────────────────────────────
nextBtn.onclick = () => {
  if (index < questions.length - 1) {
    index++;
    loadQuestion();
  }
};

prevBtn.onclick = () => {
  if (index > 0) {
    index--;
    loadQuestion();
  }
};

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
  // ✅ Use questions.length, NOT quizData.length
  document.getElementById("answerPopup").style.display = "none";
  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${questions.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
  finalPopup.style.display = "flex";
  bigConfetti();
}

// ─── Restart ──────────────────────────────────────────────
function restartQuiz() {
  // ✅ Use correct FIB variables, NOT mcq.js variables
  index = 0;
  score = 0;

  // Reset all answers
  userAnswers.forEach((ua) => {
    ua.used = [];
    ua.scored = false;
    ua.boxes = ua.boxes.map(() => ({ value: "", correct: false }));
  });

  finalPopup.style.display = "none";
  loadQuestion();
}

// ─── Init ─────────────────────────────────────────────────
loadQuestion();