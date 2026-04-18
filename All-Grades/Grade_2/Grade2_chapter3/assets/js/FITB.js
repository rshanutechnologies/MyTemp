const questions = [
  {
    question: "Delhi has an _____________ climate.",
    answer: "EXTREME",
    image: "../assets/images/F-1.png",
    letters: ["E", "X", "T", "R", "E", "M", "E"],
  },
  {
    question: "_______________ Utsav is celebrated in Visakhapatnam.",
    answer: "VISAKHA",
    image: "../assets/images/F-2.png",
    letters: ["V", "I", "S", "A", "K", "H", "A"],
  },
  {
    question: "Visakhapatnam is the most populated city in _______________.",
    answer: "ANDHRAPRADESH",
    image: "../assets/images/F-3.png",
    letters: [
      "A", "N", "D", "H", "R", "A", "P", "R", "A", "D", "E", "S", "H", "L", "T"
    ],
  },
  {
    question: "_______________ is one of the popular street foods of Hyderabad.",
    answer: "BIRYANI",
    image: "../assets/images/DinnerWB.png",
    letters: ["B", "I", "R", "Y", "A", "N", "I"],
  },
  {
    question: "_______________ lies on the banks of Musi River.",
    answer: "HYDERABAD",
    image: "../assets/images/C-4.png",
    letters: ["H", "Y", "D", "E", "R", "A", "B", "A", "D"],
  },
];

let index = 0;
let score = 0;

const locked = Array(questions.length).fill(false);
let typed = "";
let chainButtons = [];

const charImg = document.getElementById("charImg");
const questionText = document.getElementById("questionText");
const answerBoxes = document.getElementById("answerBoxes");
const lettersWrap = document.getElementById("lettersWrap");
const lettersBox = document.getElementById("lettersBox");
const progressBar = document.getElementById("progressBar");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");

const feedbackPopup = document.getElementById("feedbackPopup");
const feedbackCircle = document.getElementById("feedbackCircle");
const flyTick = document.getElementById("flyTick");

const canvas = document.getElementById("chainCanvas");
const ctx = canvas.getContext("2d");

// iOS FIXED speak function - same pattern as your MCQ
let speechInitialized = false;

function initSpeechOnUserInteraction() {
  if (speechInitialized) return;
  speechInitialized = true;
  
  // This "unlocks" speech on iOS
  const silentMsg = new SpeechSynthesisUtterance(' ');
  silentMsg.volume = 0;
  window.speechSynthesis.speak(silentMsg);
  window.speechSynthesis.cancel(); // cancel immediately
}

function speak(text) {
  if (!window.speechSynthesis) return;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-GB";
  msg.volume = 0.8;
  msg.rate = 0.9;
  msg.pitch = 1;
  
  // Try to speak immediately (iOS will work after user interaction)
  const trySpeak = () => {
    window.speechSynthesis.speak(msg);
  };
  
  // Check if voices are loaded
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      trySpeak();
    };
  } else {
    trySpeak();
  }
}

// Add this - initialize speech on first ANY user interaction
function setupSpeechOnFirstTap() {
  const events = ['click', 'touchstart', 'pointerdown'];
  const handler = () => {
    initSpeechOnUserInteraction();
    // Remove listeners after first interaction
    events.forEach(event => {
      document.body.removeEventListener(event, handler);
    });
  };
  events.forEach(event => {
    document.body.addEventListener(event, handler);
  });
}

// Call this when page loads
setupSpeechOnFirstTap();

/* shuffle tiles */
function shuffle(arr) {
  return arr
    .map((v) => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.v);
}

/* progress */
function initProgress() {
  progressBar.innerHTML = "";
  for (let i = 0; i < questions.length; i++) {
    const b = document.createElement("div");
    b.className = "progress-box";
    b.textContent = i + 1;
    progressBar.appendChild(b);
  }
}

/* answer boxes - ADDED CLICK TO REMOVE FEATURE */
function renderBoxes(q) {
  answerBoxes.innerHTML = "";
  for (let i = 0; i < q.answer.length; i++) {
    const box = document.createElement("div");
    box.className = "box";
    box.textContent = typed[i] ? typed[i] : "";
    if (typed[i]) box.classList.add("filled");
    
    // ADD THIS: Click on filled box to remove letter
    box.addEventListener("click", (e) => {
      e.stopPropagation();
      if (locked[index]) return;
      if (typed[i]) {
        removeLetterAtPosition(i);
      }
    });
    
    answerBoxes.appendChild(box);
  }
}

// NEW FUNCTION: Remove letter from specific position
function removeLetterAtPosition(pos) {
  const q = questions[index];
  if (locked[index]) return;
  if (pos >= typed.length) return;
  
  const letterToRemove = typed[pos];
  
  // Remove from typed string
  typed = typed.slice(0, pos) + typed.slice(pos + 1);
  
  // Find and restore the button at this position
  if (chainButtons[pos]) {
    const btnToRestore = chainButtons[pos];
    btnToRestore.classList.remove("used", "selected");
    chainButtons.splice(pos, 1);
  }
  
  // Re-render
  renderBoxes(q);
  drawChain();
  
  backBtn.disabled = typed.length === 0;
  nextBtn.disabled = true;
}

/* canvas size */
function resizeCanvas() {
  const r = lettersBox.getBoundingClientRect();
  canvas.width = Math.floor(r.width);
  canvas.height = Math.floor(r.height);
}

/* draw chain lines */
function drawChain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (chainButtons.length < 2) return;

  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();

  const lr = lettersBox.getBoundingClientRect();

  chainButtons.forEach((btn, i) => {
    if (!btn) return;
    const br = btn.getBoundingClientRect();
    const x = br.left - lr.left + br.width / 2;
    const y = br.top - lr.top + br.height / 2;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();
}

/* render letters */
function renderLetters(q) {
  lettersBox.innerHTML = "";

  const letters = shuffle([...q.letters]);
  letters.forEach((letter) => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    lettersBox.appendChild(btn);

    btn.addEventListener("pointerenter", () => {
      if (!isSwiping) return;
      addLetter(btn, letter);
    });

    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (locked[index]) return;
      startSwipe();
      addLetter(btn, letter);
    });
  });

  requestAnimationFrame(() => {
    resizeCanvas();
    drawChain();
  });

  if (locked[index]) {
    [...lettersBox.children].forEach((b) => b.classList.add("used"));
  }
}

/* swipe system */
let isSwiping = false;

function startSwipe() {
  if (locked[index]) return;
  isSwiping = true;
}

function stopSwipe() {
  isSwiping = false;
}

/* add letter */
function addLetter(btn, letter) {
  const q = questions[index];
  if (locked[index]) return;
  if (btn.classList.contains("used")) return;
  if (typed.length >= q.answer.length) return;

  typed += letter;
  chainButtons.push(btn);
  btn.classList.add("used", "selected");
  backBtn.disabled = typed.length === 0;
  renderBoxes(q);
  drawChain();

  if (typed.length === q.answer.length) {
    setTimeout(checkAnswer, 250);
  }
}

/* backspace undo */
function backspace() {
  const q = questions[index];
  if (locked[index]) return;
  if (typed.length === 0) return;

  typed = typed.slice(0, -1);
  const lastBtn = chainButtons.pop();
  if (lastBtn) {
    lastBtn.classList.remove("used", "selected");
  }
  renderBoxes(q);
  drawChain();
  nextBtn.disabled = true;
  backBtn.disabled = typed.length === 0;
}

/* feedback popup */
function showFeedback(type) {
  feedbackPopup.style.display = "flex";
  feedbackCircle.className = "feedback-circle " + type;
  feedbackCircle.textContent = type === "correct" ? "✔" : "✖";
  setTimeout(() => (feedbackPopup.style.display = "none"), 850);
}

function flyTickToProgress(circleIndex) {
  const target = progressBar.children[circleIndex];
  const from = feedbackCircle.getBoundingClientRect();
  const to = target.getBoundingClientRect();

  flyTick.style.opacity = "1";
  flyTick.style.left = from.left + from.width / 2 + "px";
  flyTick.style.top = from.top + from.height / 2 + "px";
  flyTick.getBoundingClientRect();
  flyTick.style.transition = "all .9s ease";
  flyTick.style.left = to.left + to.width / 2 + "px";
  flyTick.style.top = to.top + to.height / 2 + "px";
  flyTick.style.transform = "translate(-50%,-50%) scale(.35)";

  setTimeout(() => {
    flyTick.style.opacity = "0";
    flyTick.style.transition = "none";
    flyTick.style.transform = "translate(-50%,-50%) scale(1)";
  }, 950);
}

/* check answer */
function checkAnswer() {
  const q = questions[index];
  stopSwipe();

  if (typed === q.answer) {
    locked[index] = true;
    score++;

    showFeedback("correct");
    speak("Correct");
    nextBtn.disabled = false;
    backBtn.disabled = true;

    setTimeout(() => flyTickToProgress(index), 150);

    setTimeout(() => {
      const p = progressBar.children[index];
      p.classList.add("done");
      p.textContent = "✔";
    }, 950);

    if (score === questions.length) {
      setTimeout(showFinal, 1400);
    }
  } else {
    showFeedback("wrong");
    speak("Try again");
    setTimeout(() => {
      resetChain();
    }, 700);
  }
}

/* reset chain */
function resetChain() {
  typed = "";
  chainButtons.forEach((btn) => btn.classList.remove("used", "selected"));
  chainButtons = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderBoxes(questions[index]);
  [...lettersBox.children].forEach((b) => b.classList.remove("used", "selected"));
  nextBtn.disabled = true;
  backBtn.disabled = true;
}

/* load */
function loadQuestion() {
  const q = questions[index];

  charImg.src = q.image;
  questionText.textContent = q.question;

  typed = "";
  chainButtons = [];
  renderBoxes(q);
  renderLetters(q);

  prevBtn.disabled = index === 0;
  nextBtn.disabled = !locked[index];
  backBtn.disabled = true;

  if (locked[index]) {
    typed = q.answer;
    renderBoxes(q);
    [...lettersBox.children].forEach((b) => b.classList.add("used"));
    const p = progressBar.children[index];
    p.classList.add("done");
    p.textContent = "✔";
  }
}

/* final popup */
function showFinal() {
  document.getElementById("finalScoreText").textContent = `Score: ${score} / ${questions.length}`;
  document.getElementById("finalStars").textContent = "⭐".repeat(score);
  document.getElementById("finalPopup").style.display = "flex";
  // speak("Congratulations");
}

function restart() {
  index = 0;
  score = 0;
  locked.fill(false);
  document.getElementById("finalPopup").style.display = "none";
  initProgress();
  loadQuestion();
}

/* NAV */
prevBtn.onclick = () => {
  if (index > 0) {
    index--;
    loadQuestion();
  }
};

nextBtn.onclick = () => {
  if (index < questions.length - 1) {
    index++;
    loadQuestion();
  }
};

backBtn.onclick = backspace;
document.getElementById("restartBtn").onclick = restart;

/* stop swipe anywhere */
window.addEventListener("pointerup", stopSwipe);
window.addEventListener("pointercancel", stopSwipe);
window.addEventListener("resize", () => {
  resizeCanvas();
  drawChain();
});

/* init */
initProgress();
loadQuestion();