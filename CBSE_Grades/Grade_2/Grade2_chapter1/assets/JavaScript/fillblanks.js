/* ================= POPUP SYSTEM ================= */

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  icon.style.animation = "none";
  void icon.offsetWidth;
  icon.style.animation = "";

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

if (isCorrect) {
  icon.textContent = "🎉";
  title.textContent = "Correct!";
  msg.textContent = "Well done!";

  speak("Correct ");

} else {
  icon.textContent = "😔";
  title.textContent = "Wrong!";
  msg.textContent = "Try again!";

  speak("Wrong");
}

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = 
    `Score: ${score} / ${questions.length}`;

  document.getElementById("stars").textContent = 
    "⭐".repeat(score);
     fireConfettif(); 
  
}

/* ================= TILE / SLOT SYSTEM ================= */

const slots = document.getElementById("answerSlots");
const bank = document.getElementById("letterBank");

let currentTiles = []; // to track tiles for re-enabling when backspace used

function buildTiles(answer, prefill = false) {
  slots.innerHTML = "";
  bank.innerHTML = "";
  currentTiles = [];

  const correctLetters = answer.toUpperCase().split("");
  const slotCount = correctLetters.length;

  // Create empty slots
  for (let i = 0; i < slotCount; i++) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slots.appendChild(slot);
  }

  if (prefill) {
    const slotElements = [...slots.children];
    correctLetters.forEach((letter, i) => {
      slotElements[i].textContent = letter;
      slotElements[i].classList.add("locked");
    });
    return;
  }

  // Only 3 extra letters
  const extraLetters = ["A", "E", "S"];
  const mix = [...correctLetters, ...extraLetters].sort(() => Math.random() - 0.5);

  mix.forEach(l => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = l;

    tile.onclick = () => placeLetter(tile, l, answer);

    bank.appendChild(tile);
    currentTiles.push(tile);
  });
}

function placeLetter(tile, letter, answer) {
  const emptySlot = [...slots.children].find(s => !s.textContent);
  if (!emptySlot) return;

  emptySlot.textContent = letter;
  tile.classList.add("used");
  tile.onclick = null;

  checkAnswer(answer);
}

function removeLastLetter() {
  const filledSlots = [...slots.children].filter(s => s.textContent && !s.classList.contains("locked"));
  if (filledSlots.length === 0) return;

  // Remove from the last filled slot
  const lastFilled = filledSlots[filledSlots.length - 1];
  const removedLetter = lastFilled.textContent;
  lastFilled.textContent = "";

  // Re-enable the corresponding tile in bank
  const tileToReEnable = currentTiles.find(t => t.textContent === removedLetter && t.classList.contains("used"));
  if (tileToReEnable) {
    tileToReEnable.classList.remove("used");
    tileToReEnable.onclick = () => placeLetter(tileToReEnable, removedLetter, questions[index].a);
  }
}

function clearSlotsAndResetTiles() {
  [...slots.children].forEach(slot => {
    slot.textContent = "";
  });

  currentTiles.forEach(tile => {
    tile.classList.remove("used");
    tile.onclick = () => placeLetter(tile, tile.textContent, questions[index].a);
  });
}

function lockSlots() {
  [...slots.children].forEach(slot => {
    slot.classList.add("locked");
  });
}

function checkAnswer(correct) {
  const guess = [...slots.children]
    .map(s => s.textContent)
    .join("")
    .toLowerCase();

  if (guess.length !== correct.length) return;

  const isCorrect = guess === correct.toLowerCase();

  if (isCorrect) {
    score++;
    updateScore();
    showPopup(true);
     fireConfetti(); 
    answers[index] = correct;
    lockSlots();
    next.disabled = false;

    if (index === questions.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    showPopup(false);
    setTimeout(() => {
      clearSlotsAndResetTiles();
    }, 900);
  }
}

/* ================= QUESTIONS ================= */

const questions = [
  { q: "Q.1 Potato is a _ _ _ _ _ _ _ _ _ _.", a: "stem",     img: "../assets/images/Potatoakkkk.png" },
  { q: "Q.2 _ _ _ _ _ _ _ _ _ is a medicinal plant.", a: "tulsi",   img: "../assets/images/Tulsi.png" },
  { q: "Q.3 _ _ _ _ _ _ prepare food for the plant.", a: "leaves",  img: "../assets/images/LeafFoodMakee.png" },
  { q: "Q.4 The root of a plant grows _ _ _ _ _ the ground.", a: "under",   img: "../assets/images/RootUnder.png" },
  { q: "Q.5 Wood of _ _ _ _ tree is used to make furniture.", a: "teak",    img: "../assets/images/Teakak.png" }
];

let index = 0;
let score = 0;
const answers = Array(questions.length).fill(null);

/* ================= ELEMENTS ================= */

const qImgEl   = document.getElementById("qImg");
const qTextEl  = document.getElementById("qText");
const prev     = document.getElementById("prevBtn");
const next     = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");

/* ================= FUNCTIONS ================= */

function updateScore() {
  scoreBox.textContent = "Score: " + score;
}

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-UK";
  msg.volume = 0.3;
  msg.rate = 1.0;
  msg.pitch = 1.0;
  speechSynthesis.speak(msg);
}

function loadQuestion() {
  const q = questions[index];

  qImgEl.src = q.img;
  qTextEl.textContent = q.q;

  const alreadyCorrect = !!answers[index];

  buildTiles(q.a, alreadyCorrect);

  prev.disabled = index === 0;
  next.disabled = !alreadyCorrect;
}

/* ================= BACKSPACE SUPPORT ================= */

document.addEventListener("keydown", (e) => {
  if (e.key === "Backspace" || e.key === "Delete") {
    e.preventDefault();
    if (!answers[index]) {  // only allow removal if question not yet solved
      removeLastLetter();
    }
  }
});

/* ================= NAVIGATION ================= */

prev.onclick = () => {
  index--;
  loadQuestion();
};

next.onclick = () => {
  if (index < questions.length - 1) {
    index++;
    loadQuestion();
  }
};

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 }
  });
}

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 }
  });
}
/* ================= START ================= */

updateScore();
loadQuestion();