const questions = [
  {
    q: "Q1. Roots have tiny ________ that absorb water and minerals from the soil.",
    a: "Root hairs",
    img: "../assets/images/ftb1.1-img.png",
  },
  {
    q: "Q2. The leaf stalk carries water from the stem to the leaf through a vein called the ________.",
    a: "Midrib",
    img: "../assets/images/ftb2.1-img.png",
  },
  {
    q: "Q3.  ________ venation is found in many plants that have tap root system.",
    a: "Reticulate",
    img: "../assets/images/ftb3-img.png",
  },
  {
    q: "Q4. Sunlight is trapped by the ________ present in the leaves.",
    a: "Chlorophyll",
    img: "../assets/images/ftb4-img.png",
  },
  {
    q: "Q5. The leaves of cacti plants are reduced to ________ to adapt to the hot environment",
    a: "Spines",
    img: "../assets/images/ftb5-img.png",
  },
];

let index = 0;
let score = 0;
const answers = Array(5).fill(null);

const qText = document.getElementById("questionText");
const qImage = document.getElementById("qImage");
const input = document.getElementById("answerInput");
const checkBtn = document.getElementById("checkBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
// const progress = document.getElementById("progressBar");

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

// function loadProgress() {
//   progress.innerHTML = "";
//   for (let i = 0; i < 5; i++) {
//     const d = document.createElement("div");
//     if (answers[i]) d.classList.add("active");
//     progress.appendChild(d);
//   }
// }

function loadQuestion() {
  const q = questions[index];
  const qNo = document.querySelector(".q-no");
  const qTextSpan = document.querySelector(".q-text");

  const [number, ...rest] = q.q.split(" ");
  qNo.textContent = number;
  qTextSpan.textContent = rest.join(" ");

  qImage.src = q.img;

  input.value = answers[index] || "";
  input.disabled = !!answers[index];
  checkBtn.disabled = !!answers[index] || !input.value.trim();
  nextBtn.disabled = !answers[index];
  prevBtn.disabled = index === 0;

  // RESET green border
  document.querySelector(".input-row").classList.remove("correct");

  // APPLY green border if already answered
  if (answers[index]) {
    document.querySelector(".input-row").classList.add("correct");
  }

  // loadProgress();
}

input.oninput = () => {
  if (!answers[index]) checkBtn.disabled = !input.value.trim();
};

checkBtn.onclick = () => {
  const user = input.value.trim().toLowerCase();
  const correct = questions[index].a.toLowerCase();

  if (user === correct) {
    answers[index] = user;
    score++;
    speak("Correct");
    showPopup(true);
    input.disabled = true;
    checkBtn.disabled = true;
    nextBtn.disabled = false;
    document.querySelector(".input-row").classList.add("correct");
    // loadProgress();

    if (index === 4) setTimeout(showFinal, 1600);
  } else {
    speak("Wrong");
    showPopup(false);
    input.value = "";
  }
};

prevBtn.onclick = () => {
  index--;
  loadQuestion();
};
nextBtn.onclick = () => {
  index++;
  loadQuestion();
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

loadQuestion();
