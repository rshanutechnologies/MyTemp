const questions = [
  {
    img: "../assets/images/TF-1.png",
    q: "Earlier people called Bangalore as Bengaluru.",
    a: false,
  },
  {
    img: "../assets/images/TF-2.png",
    q: "Delhi is located in the northern part of India.",
    a: true,
  },
  {
    img: "../assets/images/TF-3.png",
    q: "Bengaluru is also called 'the garden city of India.'",
    a: true,
  },
  {
    img: "../assets/images/TF-4.png",
    q: "Visakhapatnam has a tropical wet and dry climate.",
    a: true,
  },
  {
    img: "../assets/images/TF-5.png",
    q: "Rasgulla is a famous sweet of Hyderabad.",
    a: false,
  },
];

let index = 0;
let locked = Array(questions.length).fill(false);
let score = 0;

const emojiEl = document.getElementById("emoji");
const qEl = document.getElementById("question");
const dropZone = document.getElementById("dropZone");
const result = document.getElementById("result");

const popup = document.getElementById("feedbackPopup");
const circle = document.getElementById("feedbackCircle");

const progressWrap = document.getElementById("progressWrap");
const flyTick = document.getElementById("flyTick");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");

function speak(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

/* ✅ init progress circles */
function initProgress() {
  progressWrap.innerHTML = "";
  for (let i = 0; i < questions.length; i++) {
    const c = document.createElement("div");
    c.className = "circle";
    c.textContent = i + 1;
    progressWrap.appendChild(c);
  }
}
initProgress();

function showFeedback(type) {
  popup.style.display = "flex";
  circle.className = "feedback-circle " + type;
  circle.innerHTML = type === "correct" ? "✔" : "✖";
  setTimeout(() => (popup.style.display = "none"), 850);
}

/* ✅ fly tick to circle */
function flyTickToCircle(circleIndex) {
  const target = progressWrap.children[circleIndex];
  if (!target) return;

  const startRect = dropZone.getBoundingClientRect();
  const endRect = target.getBoundingClientRect();

  flyTick.style.opacity = "1";
  flyTick.style.left = startRect.left + startRect.width / 2 + "px";
  flyTick.style.top = startRect.top + startRect.height / 2 + "px";

  void flyTick.offsetHeight;

  flyTick.style.transition = "all .8s ease";
  flyTick.style.left = endRect.left + endRect.width / 2 + "px";
  flyTick.style.top = endRect.top + endRect.height / 2 + "px";
  flyTick.style.transform = "translate(-50%,-50%) scale(.35)";

  setTimeout(() => {
    flyTick.style.opacity = "0";
    flyTick.style.transition = "none";
    flyTick.style.transform = "translate(-50%,-50%) scale(1)";
  }, 850);
}

/* ✅ click shift animation */
function shiftIntoDropBox(btnEl, val) {
  if (locked[index]) return;

  const start = btnEl.getBoundingClientRect();
  const end = dropZone.getBoundingClientRect();

  const copy = document.createElement("div");
  copy.className = "fly-copy " + (val ? "true" : "false");
  copy.style.left = start.left + "px";
  copy.style.top = start.top + "px";
  copy.textContent = val ? "T" : "F";
  document.body.appendChild(copy);

  // animate
  requestAnimationFrame(() => {
    copy.style.left = end.left + end.width / 2 - start.width / 2 + "px";
    copy.style.top = end.top + end.height / 2 - start.height / 2 + "px";
    copy.style.transform = "scale(.92)";
  });

  setTimeout(() => {
    copy.remove();
    // put inside drop box
    dropZone.innerHTML = `<div class="option ${val ? "true" : "false"}">${val ? "T" : "F"}</div>`;
    check(val);
  }, 480);
}

function load() {
  const q = questions[index];
  document.getElementById("quizImg").src = q.img;
  qEl.textContent = q.q;

  result.textContent = "";
  result.style.color = "#2f5d57";

  dropZone.classList.remove("locked");
  dropZone.innerHTML = "Drop here";

  prevBtn.disabled = index === 0;
  nextBtn.disabled = !locked[index];

  if (locked[index]) {
    dropZone.innerHTML = `<div class="option ${q.a ? "true" : "false"}">${q.a ? "T" : "F"}</div>`;
    dropZone.classList.add("locked");
    result.textContent = "✅ Already Correct!";
    result.style.color = "#16a34a";
  }
}
load();

/* ✅ check after click-shift */
function check(val) {
  if (locked[index]) return;

  if (val === questions[index].a) {
    locked[index] = true;
    score++;

    dropZone.classList.add("locked");

    result.textContent = "🎉 Correct!";
    result.style.color = "#16a34a";

    showFeedback("correct");
    speak("Correct");

    flyTickToCircle(index);
    setTimeout(() => {
      const c = progressWrap.children[index];
      c.classList.add("active");
      c.textContent = "✔";
    }, 650);

    nextBtn.disabled = false;

    if (score === questions.length) {
      setTimeout(showFinalPopup, 1100);
    }
  } else {
    // wrong => give chance
    dropZone.innerHTML = "Drop here";
    result.textContent = "❌ Try again!";
    result.style.color = "#dc2626";

    showFeedback("wrong");
    speak("Wrong");
  }
}

function showFinalPopup() {
  document.getElementById("finalScoreText").textContent =
    `Score: ${score} / ${questions.length}`;
  document.getElementById("finalStars").textContent = "⭐".repeat(score);
  document.getElementById("finalPopup").style.display = "flex";
}

function restartQuiz() {
  index = 0;
  score = 0;
  locked = Array(questions.length).fill(false);

  document.getElementById("finalPopup").style.display = "none";
  initProgress();
  load();
}

/* ✅ Next only if solved */
function next() {
  if (!locked[index]) return;
  if (index < questions.length - 1) {
    index++;
    load();
  }
}
function prev() {
  if (index > 0) {
    index--;
    load();
  }
}

/* ✅ click buttons */
trueBtn.addEventListener("click", () => shiftIntoDropBox(trueBtn, true));
falseBtn.addEventListener("click", () => shiftIntoDropBox(falseBtn, false));
