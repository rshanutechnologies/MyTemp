
const quizData = [
  {
    q: "Q.1 A whale is a ___.",
    animal: "🐋",
    options: ["🌊 Water Animal", "🐦 Bird ", "🏠 Pet Animal", "🐛 Insect"],
    correct: 0
  },
  {
    q: "Q.2 A parrot is a ___.",
    animal: "🦜",
    options: ["🏠 Pet Animal", "🐦 Bird ", "🌊 Water Animal", "🐛 Insect"],
    correct: 1
  },
  {
    q: "Q.3 A fish is a ___.",
    animal: "🐟",
    options: ["🏠 Pet Animal", "🐦 Bird", "🌊 Water Animal", "🐛 Insect"],
    correct: 2
  },
  {
    q: "Q.4 An ant is an ___.",
    animal: "🐜",
    options: ["🏠 Pet Animal", "🐦 Bird", "🌊 Water Animal", "🐛 Insect"],
    correct: 3
  },
  {
    q: "Q.5 A cow is a ___.",
    animal: "🐄",
    options: ["🌊 Water Animal", "🐦 Bird", "🏠 Pet Animal", "🐛 Insect"],
    correct: 2
  }
];

let index = 0;
let answers = Array(quizData.length).fill(null);
let score = 0;

const qEl = document.getElementById("question");
const animalEl = document.getElementById("animalEmoji");
const optEl = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

function speak(text) {
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

function showPopup(text) {
  popupText.textContent = text;
  popup.style.display = "flex";
  setTimeout(() => popup.style.display = "none", 900);
}

function loadQuestion() {
  const q = quizData[index];
  qEl.textContent = q.q;
  animalEl.textContent = q.animal;
  optEl.innerHTML = "";

  prevBtn.disabled = index === 0;
  nextBtn.disabled = answers[index] !== q.correct;

  q.options.forEach((text, i) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerHTML = `<span></span>${text}`;

    if (answers[index] !== null) {
      if (i === q.correct) {
        div.classList.add("correct");
        div.style.pointerEvents = "none";
      } else {
        div.classList.add("disabled");
      }
    }

    div.onclick = () => selectAnswer(div, i);
    optEl.appendChild(div);
  });
}

function selectAnswer(el, i) {
  const correct = quizData[index].correct;

  if (i !== correct) {
    el.classList.add("disabled");
    document.getElementById("wrongSound").play();
    speak("Wrong");
    showPopup("❌ Wrong Answer!");
    return;
  }

  answers[index] = i;
  score++;
  el.classList.add("correct");
  el.style.pointerEvents = "none";
  document.getElementById("correctSound").play();
  speak("Correct");
  showPopup("✅ Correct Answer!");

  document.querySelectorAll(".option").forEach((o, idx) => {
    if (idx !== correct) o.classList.add("disabled");
  });

  nextBtn.disabled = false;

  if (index === quizData.length - 1) {
    setTimeout(showFinalPopup, 1000);
  }
}

prevBtn.onclick = () => {
  index--;
  loadQuestion();
};

nextBtn.onclick = () => {
  index++;
  loadQuestion();
};

function showFinalPopup() {
  popup.style.display = "flex";
  popupText.innerHTML = `
    🎉 Quiz Completed!<br><br>
    Score: ${score} / ${quizData.length}<br><br>
    <button onclick="restart()" style="
      padding:12px 28px;
      border-radius:30px;
      border:none;
      background:#f6b93b;
      color:white;
      font-size:22px;
      cursor:pointer;
    ">🔄 Restart</button>`;
}

function restart() {
  index = 0;
  score = 0;
  answers.fill(null);
  popup.style.display = "none";
  loadQuestion();
}

loadQuestion();

