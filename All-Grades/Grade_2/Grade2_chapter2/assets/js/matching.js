// ================================================
// FIXED: Simple Click Matching - 4 Questions + 4 Answers
// Click Left → Then Click Right
// No Drag, No Shuffle, Fixed Positions
// ================================================

const PAIRS = [
  { id: 'q1', color: 'pair-c1', q: '1. Skull ', a: 'It protects our brain.', img: '../assets/images/q4-img.png' },
  { id: 'q2', color: 'pair-c2', q: '2. Ribcage ', a: 'It protects our lungs and heart.', img: '../assets/images/q2-M.png' },
  { id: 'q3', color: 'pair-c3', q: '3. Backbone ', a: 'It helps us stand up straight.', img: '../assets/images/q3-M.png' },
  { id: 'q4', color: 'pair-c4', q: '4. Joints ', a: 'They help us bend our arms and legs.', img: '../assets/images/q1-img.png' }
];

const qsEl = document.getElementById("questions");
const asEl = document.getElementById("answers");
const scoreBox = document.getElementById("scoreBox");

let selectedQuestion = null;
let score = 0;
let matched = new Set();

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function showPopup(isCorrect, imgSrc = null) {
  const popup = document.getElementById("popup");
  const popupMedia = document.getElementById("popupMedia");
  const popupText = document.getElementById("popupText");

  popupMedia.innerHTML = "";
  popupText.className = "popup-msg";

  if (isCorrect) {
    if (imgSrc) {
      const img = document.createElement("img");
      img.src = imgSrc;
      popupMedia.appendChild(img);
    }
    popupText.textContent = "Correct! ✅";
    popupText.classList.add("correct");
    speak("Correct");
  } else {
    popupMedia.innerHTML = `<div style="font-size:70px;">😢</div>`;
    popupText.textContent = "Wrong! ❌";
    popupText.classList.add("wrong");
    speak("Wrong");
  }

  popup.style.display = "flex";
  setTimeout(() => popup.style.display = "none", 1200);
}

function createQuestion(pair) {
  const q = document.createElement("div");
  q.className = `piece q-piece ${pair.color}`;
  q.dataset.id = pair.id;
  q.textContent = pair.q;

  q.addEventListener("click", () => {
    if (q.classList.contains("locked")) return;
    document.querySelectorAll(".q-piece").forEach(el => el.classList.remove("active"));
    q.classList.add("active");
    selectedQuestion = q;
  });

  return q;
}

function createAnswer(pair) {
  const a = document.createElement("div");
  a.className = "piece a-piece";
  a.dataset.id = pair.id;
  a.textContent = pair.a;

  a.addEventListener("click", () => {
    if (a.classList.contains("matched") || !selectedQuestion) return;

    if (selectedQuestion.dataset.id === a.dataset.id) {
      correct(selectedQuestion, a);
    } else {
      wrong(a);
      showPopup(false);
    }

    if (selectedQuestion) {
      selectedQuestion.classList.remove("active");
      selectedQuestion = null;
    }
  });

  return a;
}

function render() {
  qsEl.innerHTML = "";
  asEl.innerHTML = "";

  // Left Side - Questions
  PAIRS.forEach(pair => {
    qsEl.appendChild(createQuestion(pair));
  });

  // Right Side - Answers (All 4 will show now)
  const shuffled = [...PAIRS].sort(() => Math.random() - 0.5);

shuffled.forEach(pair => {
  asEl.appendChild(createAnswer(pair));
});;
}

function correct(questionEl, answerEl) {
  const id = questionEl.dataset.id;
  const pair = PAIRS.find(p => p.id === id);

  if (matched.has(id)) return;

  matched.add(id);
  score++;
  scoreBox.textContent = `Score: ${score}`;

  // ✅ lock both
  questionEl.classList.add("locked");
  answerEl.classList.add("locked", "matched");

  // 🎨 apply SAME color as question
  answerEl.classList.add(pair.color);

  // 🔒 disable clicking
  answerEl.style.pointerEvents = "none";

  showPopup(true, pair.img);

  if (matched.size === PAIRS.length) {
    setTimeout(showFinalPopup, 900);
  }
}

function wrong(answerEl) {
  answerEl.classList.add("shake");
  setTimeout(() => answerEl.classList.remove("shake"), 400);
}

function showFinalPopup() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score} / ${PAIRS.length}`;
  document.getElementById("finalStars").textContent = "⭐".repeat(score);

  const img = document.getElementById("winnerImg");
  img.style.animation = "none";
  void img.offsetWidth;
  img.style.animation = "liftTrophy 1.1s ease-in-out infinite";

  speak(`Congratulations! Your score is ${score} out of ${PAIRS.length}`);
}

function restartQuiz() {
  matched.clear();
  score = 0;
  scoreBox.textContent = "Score: 0";
  document.getElementById("finalPopup").style.display = "none";
  selectedQuestion = null;
  render();
}

function openHint() {
  document.getElementById("hintPopup").style.display = "flex";
}

function closeHint() {
  document.getElementById("hintPopup").style.display = "none";
}

// Initialize
render();