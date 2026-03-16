const quizData = [
  {
    q: "Animals that eat plants are called ____.",
    a: "herbivores",
    qImg: "../assets/images/M-3.png",
  },

  {
    q: "Flesh-eating animals are also called ____.",
    a: "carnivores",
    qImg: "../assets/images/M-2.png",
  },

  {
    q: "Shark is a ____ animal.",
    a: "water",
    qImg: "../assets/images/M-5.png",
  },

  {
    q: "____ animals eat both plants and flesh of other animals.",
    a: "omnivorous",
    qImg: "../assets/images/omnivorous.png",
  },

  {
    q: "____ is a flesh eating animal.",
    a: "tiger",
    qImg: "../assets/images/M-2.png",
  },
];

let current = 0;
let answered = Array(quizData.length).fill(false);
let userAnswers = Array(quizData.length).fill("");
const question = document.getElementById("question");
const img = document.getElementById("questionImg");
const input = document.getElementById("answerInput");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const levels = document.querySelectorAll(".level");
const prevBtns = [
  document.getElementById("prevBtn"),
  document.getElementById("prevBtnMobile"),
];

const nextBtns = [
  document.getElementById("nextBtn"),
  document.getElementById("nextBtnMobile"),
];

function showPopup(text, type, isFinal = false) {
  popup.style.display = "flex";
  popupText.className = "popup-box " + type;

  if (isFinal) {
    popupText.innerHTML = text;
    // ❌ No setTimeout here (so it stays open)
  } else {
    popupText.innerHTML = text;
    setTimeout(() => (popup.style.display = "none"), 1000);
  }
}

function flyImage() {
  if (levels[current].classList.contains("active")) return;
  const clone = img.cloneNode();
  const r = img.getBoundingClientRect();
  const t = levels[current].getBoundingClientRect();
  clone.className = "fly";
  clone.style.left = r.left + "px";
  clone.style.top = r.top + "px";
  clone.style.width = r.width + "px";
  document.body.appendChild(clone);
  setTimeout(() => {
    clone.style.left = t.left + "px";
    clone.style.top = t.top + "px";
    clone.style.width = "60px";
  }, 10);
  setTimeout(() => {
    levels[current].innerHTML = `<img src="${img.src}">`;
    levels[current].classList.add("active");
    document.body.removeChild(clone);
  }, 900);
}

function restartQuiz() {
  current = 0;

  clearInterval(confettiInterval);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // reset answer tracking
  answered = Array(quizData.length).fill(false);
  userAnswers = Array(quizData.length).fill("");

  popup.style.display = "none";

  // reset level icons
  levels.forEach((l) => {
    l.classList.remove("active", "current");
    l.innerHTML = "";
  });

  levels[0].classList.add("current");

  // disable NEXT buttons again
  nextBtns.forEach((b) => (b.disabled = true));

  load();
}

function load() {
  const q = quizData[current];
  question.textContent = q.q;
  img.src = q.qImg;
  input.value = userAnswers[current] || "";
  input.disabled = answered[current];
  levels.forEach((l) => l.classList.remove("current"));
  levels[current].classList.add("current");
  prevBtns.forEach((b) => (b.disabled = current === 0));
  nextBtns.forEach((b) => (b.disabled = !answered[current]));
}
function speakText(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}
document.getElementById("checkBtn").onclick = () => {
  if (answered[current]) return;

  if (input.value.trim().toLowerCase() === quizData[current].a) {
    answered[current] = true;
    userAnswers[current] = input.value.trim();
    flyImage();
    nextBtns.forEach((b) => (b.disabled = false));

    speakText("Correct");

    if (current === quizData.length - 1) {
      const score = answered.filter((a) => a).length;
      setTimeout(() => {
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

        document
          .getElementById("restartBtn")
          .addEventListener("click", restartQuiz);

          startConfetti();
      }, 1000);
    } else {
      showPopup("✅ Correct!", "correct");
    }
  } else {
    input.value="";
    showPopup("❌ Wrong!", "wrong");
    speakText("Try again!");
  }
};

prevBtns.forEach((btn) => {
  btn.onclick = () => {
    if (current > 0) {
      current--;
      load();
    }
  };
});

nextBtns.forEach((btn) => {
  btn.onclick = () => {
    if (current < quizData.length - 1 && answered[current]) {
      current++;
      load();
    }
  };
});

load();

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
