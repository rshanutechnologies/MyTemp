const quizData = [
  {
    q: "Q1. Living things need water to ________.",
    img: "../assets/images/mcq-1.png",
    options: ["🥤 drink", "🚶 move", "🦋 fly", "🏃 run"],
    a: 0,
  },
  {
    q: "Q2. Non-living things ________.",
    img: "../assets/images/mcq-2.png",
    options: ["🫁 breathe", "🚫 don't breathe", "🍽 eat", "⚰️ die"],
    a: 1,
  },
  {
    q: "Q3. A book is a ________ thing.",
    img: "../assets/images/mcq-3.png",
    options: [
      "🏭 human-made",
      "🌿 natural",
      "🐶 living",
      "🪨 natural non-living",
    ],
    a: 0,
  },
  {
    q: "Q4. Living things ________.",
    img: "../assets/images/mcq-4.png",
    options: ["❌ don't die", "🚫 don't grow", "⚰️ die", "❤️ can't feel"],
    a: 2,
  },
  {
    q: "Q5.  Pencils and erasers are ________ things.",
    img: "../assets/images/mcq-5.png",
    options: [
      "🪨 natural non-living",
      "🏭 human-made",
      "🐾 living",
      "🔄 both living and non-living",
    ],
    a: 1,
  },
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);

/* ✅ FIXED DOM REFERENCES */
const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const optEl = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const stations = [...document.querySelectorAll(".station")];

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function smallConfetti() {
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } });
}

function loadQuestion() {
  const q = quizData[current];
  qEl.textContent = q.q;
  imgEl.src = q.img;
  optEl.innerHTML = "";
  nextBtn.disabled = answered[current] === null;

  q.options.forEach((t, i) => {
    const d = document.createElement("div");
    d.className = "option o" + ((i % 4) + 1);
    d.innerHTML = `<span>${t.split(" ")[0]}</span>${t.slice(2)}`;

    /* RESTORE STATE */
    if (answered[current] !== null) {
      if (i === q.a) d.classList.add("correct");
      else d.classList.add("disabled");
    }

    d.onclick = () => {
      if (answered[current] !== null) return;

      if (i === q.a) {
        answered[current] = i;
        score++;

        d.classList.add("correct");
        [...optEl.children].forEach((o) => {
          if (o !== d) o.classList.add("disabled");
        });

        speak("Correct");
        smallConfetti();
        showPopup(true);
        nextBtn.disabled = false;

        if (answered.every((a) => a !== null)) {
          setTimeout(showFinal, 1600);
        }
      } else {
        speak("Wrong");
        showPopup(false);

        d.classList.add("wrong");

        setTimeout(() => {
          d.classList.remove("wrong");
        }, 700);
      }
    };

    optEl.appendChild(d);
  });

  prevBtn.disabled = current === 0;
}

prevBtn.onclick = () => {
  current--;
  loadQuestion();
};

nextBtn.onclick = () => {
  current++;
  loadQuestion();
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
    `Your Score: ${score} / ${quizData.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);

  popup.style.display = "flex";
  bigConfetti();
}

/* 🚀 START */
loadQuestion();
