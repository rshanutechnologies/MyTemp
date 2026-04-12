const quizData = [
  {
    q: "Q1. ___is necessary for burning things.",
    img: "../assets/images/mcq-1.png",
    options: [
      "../assets/images/mcq1-1.png|Carbon dioxide",
      "../assets/images/mcq1-2.png|Hydrogen",
      "../assets/images/oxygen.png|Oxygen",
      "../assets/images/mcq1-4.png|Nitrogen",
    ],              
    a: 2,
  },

  {
    q: "Q2. Nitrogen constitutes ____of the atmosphere.",
    img: "../assets/images/mcq-2.png",
    options: [
      "../assets/images/mcq2-1.png|21%",
      "../assets/images/mcq2-2.png|78%",
      "../assets/images/mcq2-3.png|27%",
      "../assets/images/mcq2-4.png|75%",
    ],
    a: 1,
  },

  {
    q: "Q3. The process in which water vapour changes into water due to cooling is called ____.",
    img: "../assets/images/mcq-3.png",
    options: [
      "../assets/images/mcq3-1.png|Evaporation",
      "../assets/images/mcq3-2.png|Condensation",
      "../assets/images/mcq3-3.png|Water cycle",
      "../assets/images/mcq3-4.png|Transpiration",
    ],
    a: 1,
  },

  {
    q: "Q4. Water is also called a universal __ as many things dissolve in it.",
    img: "../assets/images/mcq-4.png",
    options: [
      "../assets/images/mcq4-1.png|Solution",
      "../assets/images/mcq4-2.png|Vapour",
      "../assets/images/mcq4-3.png|Solvent",
      "../assets/images/mcq4-4.png|Solute",
    ],
    a: 2,
  },

  {
    q: "Q5. ___is the droplets of water found on the leaves and flowers.",
    img: "../assets/images/mcq5.png",
    options: [
      "../assets/images/fog.png|Fog",
      "../assets/images/smoke.png|Smoke",
      "../assets/images/dew.png|Dew",
      "../assets/images/mist.png|Mist",
    ],
    a: 2,
  },
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const optEl = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

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

    const img = t.split("|")[0];
    const text = t.split("|")[1];

    d.innerHTML = `<div class="option-img"><img src="${img}"></div>${text}`;

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

        if (answered.every((a) => a !== null)) setTimeout(showFinal, 1600);
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

loadQuestion();
