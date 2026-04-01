const questions = [
  {
    q: "Q1. Water vapour changes into water due to evaporation.",
    a: false,
    img: "../assets/images/TF-1.png",
  },
  {
    q: "Q2. Oxygen is used in fire extinguishers.",
    a: false,
    img: "../assets/images/TF-2.png",
  },
  {
    q: "Q3. Nitrogen is used in soft drinks.",
    a: false,
    img: "../assets/images/TF-3.png",
  },
  {
    q: "Q4. Argon is the most abundant gas in the atmosphere.",
    a: false,
    img: "../assets/images/TF-4.png",
  },
  {
    q: "Q5. When raindrops pass through a very cold region of the atmosphere, they freeze and become hail.",
    a: true,
    img: "../assets/images/TF-5.png",
  },
];

let index = 0,
  score = 0;
const answers = Array(questions.length).fill(null);

const qEl = document.getElementById("question");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");

const imgEl = document.getElementById("questionImg");

function render() {
  qEl.textContent = questions[index].q;

  imgEl.src = questions[index].img;
  imgEl.style.display = "block";

  trueBtn.disabled = false;
  falseBtn.disabled = false;
  trueBtn.classList.remove("correct");
  falseBtn.classList.remove("correct");

  if (answers[index] !== null) {
    if (answers[index] === true) {
      trueBtn.classList.add("correct");
      falseBtn.disabled = true;
    } else {
      falseBtn.classList.add("correct");
      trueBtn.disabled = true;
    }
    nextBtn.disabled = false;
  } else {
    nextBtn.disabled = true;
  }

  prevBtn.disabled = index === 0;
}

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.volume = 0.1; // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}
function smallConfetti() {
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  const duration = 500;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      zIndex: 5000  // ✅ FIX
    });

    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      zIndex: 5000  // ✅ FIX
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function answer(val) {
  if (answers[index] !== null) return;

  if (questions[index].a === val) {
    answers[index] = val;
    score++;

    speak("Correct");

    // 🎉 CONFETTI FIX (ADDED)
    // if (typeof confetti !== "undefined") {
      smallConfetti();
    //   setTimeout(() => bigConfetti(), 200);
    // }

    showPopup(true);

    if (val) {
      trueBtn.classList.add("correct");
      falseBtn.disabled = true;
    } else {
      falseBtn.classList.add("correct");
      trueBtn.disabled = true;
    }

    nextBtn.disabled = false;

    // 🎉 FINAL CONFETTI
    if (index === questions.length - 1) {
      setTimeout(() => {
        if (typeof confetti !== "undefined") {
          bigConfetti();
        }
        showFinal();
      }, 1600);
    }

  } else {
    speak("Wrong");
    showPopup(false);
  }
}

trueBtn.onclick = () => answer(true);
falseBtn.onclick = () => answer(false);

prevBtn.onclick = () => {
  if (index > 0) {
    index--;
    render();
  }
};
nextBtn.onclick = () => {
  if (index < questions.length - 1) {
    index++;
    render();
  }
};

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉😊";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "🥲💭";
    title.textContent = "Oops!";
    msg.textContent = "Try again, you can do it!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${questions.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);

  popup.style.display = "flex";
  bigConfetti();
}

render();
