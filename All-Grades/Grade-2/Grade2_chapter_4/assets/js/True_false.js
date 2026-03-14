function speak(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

const questions = [
  {
    q: "Roots transport food and water to all parts of a plant.",
    a: false,
    img: "../assets/images/TF-1.png",
  },
  { q: "Trees have a soft stem.", a: false, img: "../assets/images/TF-2.png" },
  {
    q: "Pumpkin plant is an example of a creeper.",
    a: true,
    img: "../assets/images/TF-3.png",
  },
  {
    q: "We get perfume from jasmine flower.",
    a: true,
    img: "../assets/images/TF-4.png",
  },
  {
    q: "Tulsi is a medicinal plant.",
    a: true,
    img: "../assets/images/F-2.png",
  },
];

let index = 0,
  quizEnded = false;
const correct = Array(questions.length).fill(false);

const qEl = document.getElementById("question");
const progress = document.getElementById("progress");
const stage = document.getElementById("stage");
const monkey = document.getElementById("monkey");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const questionImg = document.getElementById("questionImg");
const selectedAnswers = Array(questions.length).fill(null);

function goHome() {
  if (window.parent !== window) {
    window.parent.postMessage({ type: "goHome" }, "*");
  } else {
    location.href = "index.html";
  }
}

function renderProgress() {
  progress.innerHTML = "";
  questions.forEach((_, i) => {
    const s = document.createElement("div");
    s.className = "step";
    if (i === index) s.classList.add("active");
    if (correct[i]) s.classList.add("correct");
    s.textContent = i + 1;
    progress.appendChild(s);
  });
}

function render() {
  const q = questions[index];
  qEl.textContent = q.q;
  questionImg.src = q.img;

  prevBtn.disabled = index === 0;
  nextBtn.disabled = !correct[index];

  stage.className = "jungle";

  const trueBtn = document.querySelector(".true");
  const falseBtn = document.querySelector(".false");

  // Reset buttons
  trueBtn.style.opacity = "1";
  falseBtn.style.opacity = "1";
  trueBtn.style.boxShadow = "none";
  falseBtn.style.boxShadow = "none";
  trueBtn.disabled = false;
  falseBtn.disabled = false;

  if (correct[index]) {
    stage.classList.add("correct");
    highlightButtons();
  }

  renderProgress();
}

function showAnswerPopup(ok) {
  popup.classList.remove("hidden");
  popupEmoji.textContent = ok ? "👍" : "👎";
  popupTitle.textContent = ok ? "Correct!" : "Try Again";
  popupText.textContent = ok ? "Good job!" : "Try again";
  speak(ok ? "Correct" : "Try again");
  setTimeout(() => {
    if (!quizEnded) popup.classList.add("hidden");
  }, 1200);
}

function answer(choice) {
  if (correct[index]) return;

  const ok = choice === questions[index].a;
  showAnswerPopup(ok);

  if (!ok) {
    stage.classList.add("wrong");
    return; // ❌ DO NOT highlight or disable buttons
  }

  // ✅ Correct Answer
  correct[index] = true;
  selectedAnswers[index] = choice;
  stage.classList.remove("wrong");
  stage.classList.add("correct");

  monkey.className = "monkey step-" + correct.filter(Boolean).length;

  highlightButtons(); // highlight only when correct

  if (index === questions.length - 1) {
    quizEnded = true;
    setTimeout(showFinalPopup, 1200);
  } else {
    nextBtn.disabled = false;
  }
}

function highlightButtons() {
  const trueBtn = document.querySelector(".true");
  const falseBtn = document.querySelector(".false");

  if (questions[index].a === true) {
    trueBtn.style.boxShadow = "0 0 15px #4caf50";
  } else {
    falseBtn.style.boxShadow = "0 0 15px #4caf50";
  }

  trueBtn.disabled = true;
  falseBtn.disabled = true;
}

function showFinalPopup() {
  popup.classList.remove("hidden");
  popupEmoji.innerHTML = `<div class="final-board"><div class="pins">
  <span class="pin" style="animation-delay:.2s">🎯</span>
  <span class="pin" style="animation-delay:.5s">🎯</span>
  <span class="pin" style="animation-delay:.8s">🎯</span>
  <span class="pin" style="animation-delay:1.1s">🎯</span>
  <span class="pin" style="animation-delay:1.4s">🎯</span>
  </div></div>`;
  popupTitle.textContent = "Congratulations!";
  popupText.textContent = `Score: ${correct.filter(Boolean).length}/${questions.length}`;
  restart.classList.remove("hidden");
}

prev.onclick = () => {
  index--;
  render();
};
next.onclick = () => {
  index++;
  render();
};

restart.onclick = () => {
  index = 0;
  quizEnded = false;
  correct.fill(false);
  popup.classList.add("hidden");
  restart.classList.add("hidden");

  monkey.className = "monkey";
  render();
};

render();
