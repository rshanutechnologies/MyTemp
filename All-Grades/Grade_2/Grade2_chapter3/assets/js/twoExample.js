/* ✅ QUESTIONS */
const questions = [
  { img: "../assets/images/T-Q2.png", answer: "Tipu Sultan's Palace"},
  { img: "../assets/images/T-Q1.png", answer: "Yarada Beach" },
  { img: "../assets/images/T-Q3.png", answer: "Birla Temple" },
  { img: "../assets/images/T-Q4.png", answer: "India Gate" },
];
window.addEventListener("drop", e => e.preventDefault(), true);
window.addEventListener("dragover", e => e.preventDefault(), true);
let solved = Array(questions.length).fill(false);
let score = 0;

const grid = document.getElementById("grid");
const progressWrap = document.getElementById("progressWrap");
const flyTick = document.getElementById("flyTick");
const popup = document.getElementById("feedbackPopup");
const circle = document.getElementById("feedbackCircle");

/* ✅ Text to speech */
// function speak(text) {
//   window.speechSynthesis.cancel();
//   const u = new SpeechSynthesisUtterance(text);
//   u.lang = "en-Uk";
//   u.rate = 0.9;
//   window.speechSynthesis.speak(u);
// }

function speak(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

/* ✅ progress circles init */
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

/* ✅ fly tick */
function flyTickToCircle(circleIndex, fromEl) {
  const target = progressWrap.children[circleIndex];
  if (!target) return;

  const startRect = fromEl.getBoundingClientRect();
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

function norm(t) {
  return t.trim().toLowerCase().replace(/\s+/g, " ");
}

/* ✅ UI */
function render() {
  grid.innerHTML = "";

  questions.forEach((q, i) => {
    const item = document.createElement("div");
    item.className = "item";

    item.innerHTML = `
      <img src="${q.img}" alt="Q${i + 1}" />

      <div class="input-row">
        <input class="answer" id="ans${i}" placeholder="Type here..." ${solved[i] ? "readonly" : ""} />
        <button class="check-btn" id="btn${i}" onclick="check(${i})" ${solved[i] ? "disabled" : ""}>Check</button>
      </div>
    `;

    grid.appendChild(item);

    const input = document.getElementById("ans" + i);
const btn = document.getElementById("btn" + i);
/* 🚫 BLOCK DROP */
input.addEventListener("drop", (e) => {
  e.preventDefault();
});

/* 🚫 BLOCK PASTE */
input.addEventListener("paste", (e) => {
  e.preventDefault();
});

/* 🚫 BLOCK RIGHT CLICK */
input.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
// 🔒 Disable initially if empty
btn.disabled = input.value.trim() === "" || solved[i];

// 🎯 Enable only when user types
input.addEventListener("input", () => {

  let val = input.value;

  // 🚨 REMOVE URL / IMAGE PATH (YOUR BUG FIX)
  if (
    val.includes("http") ||
    val.includes("www.") ||
    val.includes("blob:") ||
    val.includes("data:") ||
    val.match(/\.(png|jpg|jpeg|gif|webp)$/i)
  ) {
    input.value = "";
    btn.disabled = true;
    return;
  }

  // ✅ CLEAN TEXT (allow letters + space + ')
  input.value = val.replace(/[^a-zA-Z ']/g, "");

  // enable button
  btn.disabled = input.value.trim() === "" || solved[i];
});


    if (solved[i]) {
      document.getElementById("ans" + i).value = questions[i].answer;
    }
  });
}
render();

/* ✅ Check */
function check(i) {
  if (solved[i]) return;

  const input = document.getElementById("ans" + i);
  const btn = document.getElementById("btn" + i);

  if (norm(input.value) === norm(questions[i].answer)) {
    solved[i] = true;
    score++;

    input.value = questions[i].answer;
    input.readOnly = true;
    btn.disabled = true;

    showFeedback("correct");
    speak("Correct");

    flyTickToCircle(i, input);

    setTimeout(() => {
      const c = progressWrap.children[i];
      c.classList.add("active");
      c.textContent = "✔";
    }, 650);

    if (score === questions.length) {
      setTimeout(showFinalPopup, 1100);
    }
  } else {
  showFeedback("wrong");
  speak("Try again");

  // ❌ clear wrong answer
  input.value = "";

  // 🔒 disable button again after clearing
  btn.disabled = true;
}
}

/* ✅ Final */
function showFinalPopup() {
  document.getElementById("finalScoreText").textContent =
    `Score: ${score} / ${questions.length}`;
  document.getElementById("finalStars").textContent = "⭐".repeat(score);
  document.getElementById("finalPopup").style.display = "flex";
  speak("Congratulations");
}

function restartQuiz() {
  score = 0;
  solved = Array(questions.length).fill(false);

  document.getElementById("finalPopup").style.display = "none";
  initProgress();
  render();
}
