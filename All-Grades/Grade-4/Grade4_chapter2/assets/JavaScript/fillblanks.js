const questions = [
  {
    q: "Q1. The natural home of a living organism is called its ________.",
    a: "habitat",
    img: "../assets/images/Habitat.png",
  },
  {
    q: "Q2. Plants that grow on land are called ________ plants.",
    a: "terrestrial",
    img: "../assets/images/forest-img.png",
  },
  {
    q: "Q3. Plants that grow in water are called ________ plants.",
    a: "aquatic",
    img: "../assets/images/aquatic.png",
  },
  {
    q: "Q4. ________ trees do not shed their leaves throughout the year.",
    a: "evergreen",
    img: "../assets/images/evergreen-plant.png",
  },
  {
    q: "Q5. The leaves of submerged plants do not have ________.",
    a: "stomata",
    img: "../assets/images/submerged-plant.png",
  },
];

let index = 0,
  score = 0;
const answers = Array(questions.length).fill(null);

const qText = document.getElementById("qText");
const qImg = document.getElementById("qImg");
const input = document.getElementById("answerInput");
const check = document.getElementById("checkBtn");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
const inputBox = document.getElementById("inputBox");
// const partsProgress = document.getElementById("partsProgress");
// partsProgress.style.gridTemplateColumns = `repeat(${questions.length}, 1fr)`;

// questions.forEach(() => {
//   const part = document.createElement("div");
//   part.className = "part";
//   partsProgress.appendChild(part);
// });

function goHome() {
  window.location.href = "../index.html";
}

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function updateProgress() {
  const parts = document.querySelectorAll(".part");
  parts.forEach((part, i) => {
    part.classList.toggle("done", answers[i] !== null);
  });
}

function load() {
  const q = questions[index];

  qText.textContent = q.q;
  qImg.src = q.img;

  input.value = answers[index] || "";
  input.disabled = answers[index] !== null;
  check.disabled = answers[index] !== null || !input.value.trim();

  inputBox.classList.toggle("correct", answers[index] !== null);

  // ✅ BUTTON RULES
  prev.disabled = index === 0;
  next.disabled = answers[index] === null;

  updateProgress();
}

input.oninput = () => {
  if (!answers[index]) check.disabled = !input.value.trim();
};

check.onclick = () => {
  if (input.value.trim().toLowerCase() === questions[index].a) {
    answers[index] = questions[index].a;
    score++;
    speak("Correct");
    showPopup(true);
    updateProgress();

    load();

    if (index === questions.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    speak("Wrong");
    showPopup(false);
    input.value = "";
    check.disabled = true;
  }
};

prev.onclick = () => {
  index--;
  load();
};
next.onclick = () => {
  index++;
  load();
};

/* POPUPS */
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";
  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }
  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/5`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

  // 🎉 CONFETTI EFFECT
  if (window.innerWidth >= 769) {
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

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
}

load();
