const quizData = [
  {
    q: "All animals eat the same type of food.",
    a: false,
    img: "../assets/images/MCQ_4.png",
  },
  {
    q: "All animals live in forests.",
    a: false,
    img: "../assets/images/T-2.png",
  },
  {
    q: "Hawk is a flesh eating animal.",
    a: true,
    img: "../assets/images/T-3.png",
  },
  {
    q: "Omnivores are flesh eating animals.",
    a: false,
    img: "../assets/images/bear.png",
  },
  {
    q: "Deer is a plant eating animal.",
    a: true,
    img: "../assets/images/MCQ_3.png",
  },
];

let current = 0;
let answered = Array(quizData.length).fill(false);

const question = document.getElementById("question");
const img = document.getElementById("questionImg");
const levels = document.querySelectorAll(".level");
const prevBtns = [
  document.getElementById("prevBtn"),
  document.getElementById("prevBtnMobile"),
];

const nextBtns = [
  document.getElementById("nextBtn"),
  document.getElementById("nextBtnMobile"),
];

// function showPopup(text,type){
//  popup.style.display="flex";
//  popupText.className="popup-box "+type;
//  popupText.innerHTML=text;
//  setTimeout(()=>popup.style.display="none",1000);
// }

function showPopup(text, type, isFinal = false) {
  popup.style.display = "flex";
  popupText.className = "popup-box " + type;
  popupText.innerHTML = text;

  // Only auto close if NOT final
  if (!isFinal) {
    setTimeout(() => {
      popup.style.display = "none";
    }, 1000);
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

  answered = Array(quizData.length).fill(false);

  popup.style.display = "none";

  levels.forEach((l) => {
    l.classList.remove("active", "current");
    l.innerHTML = "";
  });

  levels[0].classList.add("current");

  nextBtns.forEach((btn) => {
    if (btn) btn.disabled = true;
  });

  load();
}
function load() {
  const q = quizData[current];
  question.textContent = q.q;
  img.src = q.img;

  levels.forEach((l) => l.classList.remove("current"));
  levels[current].classList.add("current");

  // prevBtns.forEach(btn=>{
  //   btn.onclick=()=>{
  //     if(current>0){
  //       current--;
  //       load();
  //     }
  //   };
  // });

  // nextBtns.forEach(btn=>{
  //   btn.onclick=()=>{
  //     if(current<quizData.length-1 && answered[current]){
  //       current++;
  //       load();
  //     }
  //   };
  // });

  // Remove previous highlight
  document.querySelector(".true-btn").classList.remove("highlight-correct");
  document.querySelector(".false-btn").classList.remove("highlight-correct");

  // If already answered correctly, highlight correct answer
  if (answered[current]) {
    if (q.a === true) {
      document.querySelector(".true-btn").classList.add("highlight-correct");
    } else {
      document.querySelector(".false-btn").classList.add("highlight-correct");
    }
  }
  // ===== BUTTON ENABLE / DISABLE LOGIC =====

  // PREV button
  prevBtns.forEach((btn) => {
    if (btn) btn.disabled = current === 0;
  });

  // NEXT button (only if correct answered)
  nextBtns.forEach((btn) => {
    if (btn) btn.disabled = !answered[current];
  });
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

function checkAnswer(val) {
  if (answered[current]) return;

  if (val === quizData[current].a) {
    answered[current] = true;
    flyImage();
    nextBtns.forEach((btn) => {
      if (btn) btn.disabled = false;
    });

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
                  style="
                  margin-top:15px;
                  padding:10px 20px;
                  border:none;
                  border-radius:20px;
                  background:#28a745;
                  color:#fff;
                  font-size:16px;
                  font-weight:bold;
                  cursor:pointer;
                  display:block;
                  margin-inline:auto;
                  ">
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
    showPopup("❌ Wrong!", "wrong");
    speakText("Try again!");
  }
}

prevBtns.forEach((btn) => {
  if (!btn) return;

  btn.onclick = () => {
    if (current > 0) {
      current--;
      load();
    }
  };
});

nextBtns.forEach((btn) => {
  if (!btn) return;

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
