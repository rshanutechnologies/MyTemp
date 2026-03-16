const questions = [
  {
    q: " The narrow, thin-walled blood vessels are called ____.",
    o: ["Arteries", "Capillaries", "Capillary"],
    a: "Capillaries",
  },
  {
    q: " The organ that pumps blood throughout the body is ____.",
    o: ["Heart", "Cardiac muscle", "Lungs"],
    a: "Heart",
  },
  {
    q: " The upper two chambers of the heart are called ____.",
    o: ["Atria", "Ventricles", "Atrium"],
    a: "Atria",
  },
  {
    q: " The soft, spongy, delicate organs in our body are ____.",
    o: ["Lungs", "Pulmonary organs", "Kidneys"],
    a: ["Lungs"],
  },
  {
    q: " The dome-shaped muscular part located below the lungs is ____.",
    o: ["Diaphragm", "Thoracic diaphragm", "Ribs"],
    a: ["Diaphragm"],
  },
];

let index = 0;
let score = 0;

const state = questions.map(() => ({
  ans: [null, null],
  correct: false,
}));

const qEl = document.getElementById("question");
const qnum = document.getElementById("qnum");
const blanks = [...document.querySelectorAll(".blank")];
const bank = document.querySelector(".word-bank");
const submit = document.querySelector(".submit");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const scoreEl = document.getElementById("score");

const progressContainer = document.getElementById("progress");

/* ---------- LOAD QUESTION ---------- */
function load() {
  const s = state[index];
  const q = questions[index];

  qEl.textContent = q.q;
  qnum.textContent = index + 1;

  blanks.forEach((b, i) => {
    b.className = "blank";
    b.textContent = s.ans[i] || "Click";

    if (s.correct) b.classList.add("correct");
    else if (s.ans[i]) b.classList.add("filled");
  });

  bank.innerHTML = "";

  q.o.forEach((w) => {
    const d = document.createElement("div");
    d.className = "word";
    d.textContent = w;

    if (s.ans.includes(w) || s.correct)
      d.classList.add("used");

    d.onclick = () => pick(w);
    bank.appendChild(d);
  });

  submit.disabled = s.correct || s.ans.includes(null);
  next.disabled = !s.correct;
  prev.disabled = index === 0;

  renderProgress();
}

/* ---------- WORD PICK ---------- */
function pick(word) {
  const s = state[index];
  if (s.correct) return;

  const i = s.ans.indexOf(null);
  if (i === -1) return;

  s.ans[i] = word;
  load();
}

/* ---------- SPEECH ---------- */
function speak(text) {
  if (!("speechSynthesis" in window)) return;

  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

/* ---------- SUBMIT ---------- */
submit.onclick = () => {
  const s = state[index];
  const q = questions[index];

  // const ok = s.ans.every((v) => q.a.includes(v));
 const ok =
  !s.ans.includes(null) &&
  s.ans.every(v => q.a.includes(v));


  blanks.forEach((b) =>
    b.classList.add(ok ? "correct" : "incorrect")
  );

if (ok) {
  s.correct = true;
  score++;

  showPopup(true);
  speak("Correct");
    next.disabled = false; 
  scoreEl.textContent = score;

 setTimeout(load, 300);

  if (index === questions.length - 1)
    setTimeout(showFinal, 1400);
}
 else {
    speak("Wrong");
    showPopup(false);

    setTimeout(() => {
      s.ans = [null, null];
      load();
    }, 600);
  }
};

/* ---------- NAVIGATION ---------- */
prev.onclick = () => {
  index--;
  load();
};

next.onclick = () => {
  if (index < questions.length - 1) {
    index++;
    load();
  }
};

/* ---------- PROGRESS BAR ---------- */
function renderProgress() {
  progressContainer.innerHTML = "";

  questions.forEach((_, i) => {
    const step = document.createElement("div");
    step.className = "station";

    if (state[i].correct)
      step.classList.add("done");

    if (i === index)
      step.classList.add("active");

    if (i === questions.length - 1) {
      step.classList.add("finish");
      step.textContent = "🏁";
    } else {
      step.textContent = i + 1;
    }

    progressContainer.appendChild(step);
  });
}

/* ---------- POPUPS ---------- */
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className =
    "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

  icon.textContent = isCorrect ? "🎉" : "😔";
  title.textContent = isCorrect
    ? "Correct!"
    : "Wrong!";
  msg.textContent = isCorrect
    ? "Well done!"
    : "Try again!";

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

/* ---------- FINAL ---------- */
function showFinal() {
  const finalPopup =
    document.getElementById("finalPopup");

  finalPopup.style.display = "flex";

  document.getElementById(
    "finalScore"
  ).textContent = `Score: ${score}/${questions.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);

  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });

    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });

    if (Date.now() < end)
      requestAnimationFrame(frame);
  })();
}

/* ---------- START ---------- */
load();
