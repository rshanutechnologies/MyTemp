const quizData = [
  {
    q: "Animals that live in our houses are called ____ animals.",
    qImg: "../assets/images/MCQ_1.png",
    options: ["pet", "domestic", "wild"],
    answer: 0,
  },
  {
    q: "Flesh-eating animals are also called ____.",
    qImg: "../assets/images/MCQ_2.png",
    options: ["herbivores", "carnivores", "omnivores"],
    answer: 1,
  },
  {
    q: "Plant eating animals are also called ____.",
    qImg: "../assets/images/MCQ_3.png",
    options: ["herbivores", "carnivores", "omnivores"],
    answer: 0,
  },
  {
    q: "Animals that live in forest are called ____ animals.",
    qImg: "../assets/images/MCQ_4.png",
    options: ["pet", "domestic", "wild"],
    answer: 2,
  },
  {
    q: "Duck is a ____ animal.",
    qImg: "../assets/images/MCQ_5.png",
    options: ["wild", "aquatic", "pet"],
    answer: 1,
  },
];

let current = 0;
let answered = Array(quizData.length).fill(null);

const question = document.getElementById("question");
const questionImg = document.getElementById("questionImg");
const optionsBox = document.getElementById("options");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const levels = document.querySelectorAll(".level");
let correctAnswered = Array(quizData.length).fill(false);
nextBtn.disabled = true;
levels[0].classList.add("current");

function speak(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}
function showPopup(text, type) {
  popup.style.display = "flex";
  popupText.className = "popup-box " + type;
  popupText.innerHTML = text;
  setTimeout(() => (popup.style.display = "none"), 1000);
}

function flyImage() {
  const img = questionImg.cloneNode();
  const rect = questionImg.getBoundingClientRect();
  const target = levels[current].getBoundingClientRect();
  img.className = "fly";
  img.style.left = rect.left + "px";
  img.style.top = rect.top + "px";
  img.style.width = rect.width + "px";
  document.body.appendChild(img);
  setTimeout(() => {
    img.style.left = target.left + "px";
    img.style.top = target.top + "px";
    img.style.width = "60px";
  }, 10);
  setTimeout(() => {
    levels[current].innerHTML = `<img src="${questionImg.src}">`;
    levels[current].classList.add("active");
    levels.forEach((l) => l.classList.remove("current"));
    if (levels[current + 1]) levels[current + 1].classList.add("current");
    document.body.removeChild(img);
  }, 900);
}

function restartQuiz() {
  current = 0;

  clearInterval(confettiInterval);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  answered = Array(quizData.length).fill(null);
  correctAnswered = Array(quizData.length).fill(false);

  popup.style.display = "none";

  // reset level icons
  levels.forEach((l) => {
    l.classList.remove("active", "current");
    l.innerHTML = "";
  });

  levels[0].classList.add("current");

  nextBtn.disabled = true;

  loadQuestion();
}

function loadQuestion() {
  const q = quizData[current];
  question.textContent = q.q;
  questionImg.src = q.qImg;
  optionsBox.innerHTML = "";

  q.options.forEach((text, i) => {
    const d = document.createElement("div");
    d.className = "option";
    d.textContent = text;

    if (answered[current] !== null) {
      if (i === q.answer) d.classList.add("correct");
      else d.classList.add("disabled");
    }

    d.onclick = () => {
      if (answered[current] !== null) return;

      if (i === q.answer) {
        answered[current] = i;
        correctAnswered[current] = true; // ✅ mark correct

        speak("Correct");
        d.classList.add("correct");

        flyImage();

        nextBtn.disabled = false; // ✅ enable NEXT only now

        if (current === quizData.length - 1) {
          const score = correctAnswered.filter((a) => a).length;
         setTimeout(()=> {
          popup.style.display = "flex";
          popupText.className = "popup-box final";
          popupText.innerHTML = `
                🎉 Congratulations!
                <div style="margin-top:10px;font-size:22px;font-weight:600;text-align:center">
                  Score: ${score}/5
                </div>

                <button id="restartBtn"
                  style="margin-top:15px;padding:10px 20px;border:none;border-radius:20px;
                  background:#28a745;color:#fff;font-size:16px;font-weight:bold;cursor:pointer;margin-inline:auto;">
                  🔄 Play Again
                </button>
              `;
          setTimeout(() => {
            document.getElementById("restartBtn").onclick = restartQuiz;
          }, 50);
          startConfetti();
         }, 1000)
        } else {
          showPopup("✅ Correct!", "correct");
        }
      } else {
        speak("try again");
        showPopup("❌ Wrong!", "wrong");

        // ❌ keep NEXT disabled
        nextBtn.disabled = true;
      }
    };
    optionsBox.appendChild(d);
  });

  // PREV enabled only after moving forward
  prevBtn.disabled = current === 0;

  // NEXT enabled only if question answered correctly
  nextBtn.disabled = !correctAnswered[current];
}

prevBtn.onclick = () => {
  if (current > 0) {
    current--;
    loadQuestion();
  }
};
nextBtn.onclick = () => {
  if (current < quizData.length - 1 && correctAnswered[current]) {
    current++;
    loadQuestion();
  }
};
loadQuestion();

/* CONFETTI */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
let pieces = Array.from({ length: 150 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 6 + 2,
  d: Math.random() * 150,
  color: `hsl(${Math.random() * 360},100%,50%)`,
}));

let confettiInterval;
function startConfetti() {
  clearInterval(confettiInterval);

  confettiInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y += Math.cos(p.d) + 1;
      p.x += Math.sin(p.d);
      if (p.y > canvas.height) p.y = 0;
    });
  }, 20);
}
