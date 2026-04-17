const questions = [
  {
    q: "There is less oxygen in high altitudes.",
    a: true,
    img: "../assets/images/tf1.png",
  },
  {
    q: "Desert animals like camels have short legs.",
    a: false,
    img: "../assets/images/camel.png",
  },
  {
    q: "Sharks and fishes move with the help of their flippers.",
    a: false,
    img: "../assets/images/shark.png",
  },
  {
    q: "Desert animals have adaptive features like storing water in their bodies.",
    a: true,
    img: "../assets/images/da.png",
  },
  {
    q: "Polar bears sleep during summer to save energy.",
    a: false,
    img: "../assets/images/polar-bear.png",
  },
];

let index = 0,
  score = 0;
const answers = Array(questions.length).fill(null);

const qEl = document.getElementById("question");
const imgEl = document.getElementById("qImage");
const progress = document.querySelector(".progress");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");

function stars() {
  progress.innerHTML = "";

  questions.forEach((_, i) => {
    const item = document.createElement("div");
    item.className = "item";

    if (answers[i] === true) {
      item.classList.add("active");
      item.textContent = "⭐";
    } else {
      item.classList.add("lock");
      item.textContent = "🔒";
    }

    progress.appendChild(item);
  });
}

function render() {
  const currentQ = questions[index];
  document.getElementById("qIndex").textContent = `Q${index + 1}.`;
  qEl.textContent = currentQ.q;

  imgEl.src = currentQ.img;

  // Always reset to enabled/full opacity first
  trueBtn.disabled = false;
  falseBtn.disabled = false;
  trueBtn.style.opacity = "1";
  falseBtn.style.opacity = "1";

  // Only lock buttons if this question was already solved correctly
  if (answers[index] === true) {
    nextBtn.disabled = false;
    trueBtn.disabled = true;
    falseBtn.disabled = true;
    const wrongBtn = currentQ.a === true ? falseBtn : trueBtn;
    wrongBtn.style.opacity = "0.3";
  } else {
    nextBtn.disabled = true;
  }

  prevBtn.disabled = index === 0;
  stars();
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
  if (answers[index] === true) return;

  const isCorrect = questions[index].a === val;

  if (isCorrect) {
    answers[index] = true;
    score++;
    speak("Correct");
    showPopup(true);
    nextBtn.disabled = false;

    trueBtn.disabled = true;
    falseBtn.disabled = true;

    const btn = val ? trueBtn : falseBtn;
    const wrongBtn = val ? falseBtn : trueBtn;

    btn.classList.add("correct");
    wrongBtn.style.opacity = "0.3";
    setTimeout(() => btn.classList.remove("correct"), 500);
    if (index === questions.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    speak("Wrong");
    showPopup(false);
    const btn = val ? trueBtn : falseBtn;
    btn.classList.add("wrong");
    setTimeout(() => {
      btn.classList.remove("wrong");
    }, 500);
  }
  stars();
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
  } else {
    document.getElementById("final").style.display = "flex";
    document.getElementById("finalScore").textContent =
      `Score: ${score}/${questions.length}`;
    document.getElementById("finalStars").textContent = "⭐".repeat(score);
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
