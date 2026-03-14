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
  { q: "Potato is a ________.", a: "stem", img: "../assets/images/F-1.png" },
  {
    q: "________ is a medicinal plant.",
    a: "neem",
    img: "../assets/images/neem-img.png",
  },
  { q: "Maize is a ________.", a: "cereal", img: "../assets/images/F-3.png" },
  {
    q: "The root of a plant grows ________ the ground.",
    a: "under",
    img: "../assets/images/F-4.png",
  },
  {
    q: "Wood of ________ tree is used to make furniture.",
    a: "oak",
    img: "../assets/images/F-5.png",
  },
];

let correct = Array(questions.length).fill(false);
let score = 0;
let currentIndex = 0; // first active
let quizEnded = false;

const qBox = document.getElementById("questions");
const progress = document.getElementById("progress");

function renderProgress() {
  progress.innerHTML = "";
  questions.forEach((_, i) => {
    const s = document.createElement("div");
    s.className = "step";
    if (i === currentIndex) s.classList.add("active");
    if (correct[i]) s.classList.add("correct");
    s.textContent = i + 1;
    progress.appendChild(s);
  });
}

function renderQuestions() {
  qBox.innerHTML = "";
  questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "question q" + i;
    if (i === currentIndex) div.classList.add("active");

    // if(i%2!==0) div.classList.add("reverse"); // alternate image side

    div.innerHTML = `
      <img src="${q.img}">
      <div class="question-text">${q.q}
        <div class="input-row ${correct[i] ? "correct" : ""}">
         <input value="${userAnswers[i]}" ${correct[i] ? "disabled" : ""}>

          <button ${correct[i] ? "disabled" : ""}>Check</button>
        </div>
      </div>`;

    const input = div.querySelector("input");
    const btn = div.querySelector("button");

    btn.onclick = () => {
      if (correct[i]) return;

      const value = input.value.trim().toLowerCase();
      const ok = value === q.a;

      showAnswerPopup(ok);
      if (!ok) {
        input.value = "";
        return;
      }

      correct[i] = true;
      userAnswers[i] = q.a; // store correct answer permanently
      score++;

      if (i < questions.length - 1) {
        currentIndex = i + 1;
      }
      renderQuestions();
      renderProgress();

      if (score === questions.length) {
        quizEnded = true;
        setTimeout(showFinalPopup, 1200);
      }
    };

    qBox.appendChild(div);
  });
  renderProgress();
}

/* POPUPS */
const popup = document.getElementById("popup");
const popupEmoji = document.getElementById("popupEmoji");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");
const restartBtn = document.getElementById("restart");
let userAnswers = Array(questions.length).fill("");

function showAnswerPopup(ok) {
  popup.classList.remove("hidden");
  restartBtn.classList.add("hidden");

  popupEmoji.textContent = ok ? "👍" : "👎";
  popupTitle.textContent = ok ? "Correct!" : "Try Again";
  popupText.textContent = ok ? "Good job!" : "Try again";
  speak(ok ? "Correct" : "Try again");
  setTimeout(() => {
    if (!quizEnded) popup.classList.add("hidden");
  }, 1200);
}

function showFinalPopup() {
  popup.classList.remove("hidden");
  popupEmoji.innerHTML = `
    <div class="final-board">
      <div class="pins">
        <span class="pin" style="animation-delay:0.2s">🎯</span>
        <span class="pin" style="animation-delay:0.5s">🎯</span>
        <span class="pin" style="animation-delay:0.8s">🎯</span>
        <span class="pin" style="animation-delay:1.1s">🎯</span>
        <span class="pin" style="animation-delay:1.4s">🎯</span>
      </div>
    </div>`;
  popupTitle.textContent = "Congratulations!";
  popupText.textContent = `Score: ${score}/${questions.length}`;
  restartBtn.classList.remove("hidden");
}

restartBtn.onclick = () => {
  correct.fill(false);
  userAnswers.fill("");
  score = 0;
  currentIndex = 0;
  quizEnded = false;
  popup.classList.add("hidden");
  renderQuestions();
};

renderQuestions();
