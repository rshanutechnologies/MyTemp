const questions = [
  {
    q: "Q.1 The narrow, thin-walled blood vessels are called ____.",
    o: ["Arteries", "Capillaries", "Capillary"],
    a: "Capillaries",
  },
  {
    q: "Q.2 The organ that pumps blood throughout the body is ____.",
    o: ["Heart", "Cardiac muscle", "Lungs"],
    a: "Heart",
  },
  {
    q: "Q.3 The upper two chambers of the heart are called ____.",
    o: ["Atria", "Ventricles", "Atrium"],
    a: "Atria",
  },
  {
    q: "Q.4 The soft, spongy, delicate organs in our body are ____.",
    o: ["Lungs", "Pulmonary organs", "Kidneys"],
    a: "Lungs",
  },
  {
    q: "Q.5 The dome-shaped muscular part located below the lungs is ____.",
    o: ["Diaphragm", "Thoracic diaphragm", "Ribs"],
    a: "Diaphragm",
  },
];

let index = 0;
let score = 0;

const state = questions.map(() => ({
  ans: null,
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

  blanks[0].className = "blank";
  blanks[0].textContent = s.ans || "Click";

  if (s.correct) blanks[0].classList.add("correct");
  else if (s.ans) blanks[0].classList.add("filled");

  bank.innerHTML = "";

  q.o.forEach((w) => {
    const d = document.createElement("div");
    d.className = "word";
    d.textContent = w;

    if (s.ans === w || s.correct) d.classList.add("used");

    d.onclick = () => pick(w);
    bank.appendChild(d);
  });

  // submit.disabled = s.correct || !s.ans;
  submit.disabled = s.correct || !s.ans;
  submit.style.pointerEvents = s.correct ? "none" : "auto";
  next.disabled = !s.correct;
  prev.disabled = index === 0;

  renderProgress();
}

/* ---------- WORD PICK ---------- */
function pick(word) {
  const s = state[index];
  if (s.correct) return;

  s.ans = word;
  load();
}

/* ---------- SPEECH ---------- */
// function speak(text) {
//   if (!("speechSynthesis" in window)) return;

//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(text));
// }

function speak(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25; // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}
/* ---------- SUBMIT ---------- */
submit.onclick = () => {
  const s = state[index];
  const q = questions[index];

  const ok = s.ans === q.a;

  blanks[0].classList.add(ok ? "correct" : "incorrect");

  if (ok) {
    s.correct = true;
    score++;

    showPopup(true);
    speak("Correct");
    submit.disabled = true;
    next.disabled = false;

    if (index === questions.length - 1) setTimeout(showFinal, 1400);
  } else {
    speak("Wrong");
    showPopup(false);

    setTimeout(() => {
      s.ans = null;
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

    if (state[i].correct) step.classList.add("done");

    if (i === index) step.classList.add("active");

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

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

  icon.textContent = isCorrect ? "🎉" : "😔";
  title.textContent = isCorrect ? "Correct!" : "Wrong!";
  msg.textContent = isCorrect ? "Well done!" : "Try again!";

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

/* ---------- FINAL ---------- */
function showFinal() {
  const finalPopup = document.getElementById("finalPopup");

  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${questions.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);
}

/* ---------- START ---------- */
load();
