const questions = [
  {
    q: "Q1. Air does not help in the dispersal of seeds.",
    a: false,
    img: "../assets/images/true-1.png",
  },
  {
    q: "Q2. Renewable resources can be replenished naturally.",
    a: true,
    img: "../assets/images/true-2.png",
  },
  {
    q: "Q3. Takes one year for the formation of fossil fuels.",
    a: false,
    img: "../assets/images/true-3.png",
  },
  {
    q: "Q4. The process of planting trees is called afforestation.",
    a: true,
    img: "../assets/images/true-4.png",
  },
  {
    q: "Q5. Gold and silver are used to make jewellery.",
    a: true,
    img: "../assets/images/true-5.png",
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
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}
function answer(val) {
  if (answers[index] !== null) return;

  if (questions[index].a === val) {
    answers[index] = val;
    score++;
    speak("Correct");
    showPopup(true);
    if (val) {
      trueBtn.classList.add("correct");
      falseBtn.disabled = true;
    } else {
      falseBtn.classList.add("correct");
      trueBtn.disabled = true;
    }
    nextBtn.disabled = false;
    if (index === questions.length - 1) setTimeout(showFinal, 1600);
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

render();
