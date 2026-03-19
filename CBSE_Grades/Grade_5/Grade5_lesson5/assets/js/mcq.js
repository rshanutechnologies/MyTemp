const quizData = [
  {
    q: "Q1. Which of the following is not a part of the circulatory system?",
    img: "../assets/images/circulatory-system.png",
    options: [
      "../assets/images/heart.png|Heart",
      "../assets/images/windpipe.png|Windpipe",
      "../assets/images/blood.png|Blood",
      "../assets/images/blood-vessels.png|Blood vessels",
    ],
    a: 1,
  },

  {
    q: "Q2. The dome-shaped muscular organ located below the lungs is the ______.",
    img: "../assets/images/lungs1.png",
    options: [
      "../assets/images/heart.png|Heart",
      "../assets/images/diaphragm.png|Diaphragm",
      "../assets/images/lungs.png|Lungs",
      "../assets/images/question.png|None of these",
    ],
    a: 1,
  },

  {
    q: "Q3. The average heart beat per minute in an adult is ______.",
    img: "../assets/images/heartbeat.png",
    options: [
      "../assets/images/number12.png|12",
      "../assets/images/number60.png|60",
      "../assets/images/number30.png|30",
      "../assets/images/number72.png|72",
    ],
    a: 3,
  },

  {
    q: "Q4. The ______ carries back blood from different parts of the body to the heart.",
    img: "../assets/images/blood-circulation.png",
    options: [
      "../assets/images/artery.png|Arteries",
      "../assets/images/vein.png|Veins",
      "../assets/images/capillaries.png|Capillaries",
      "../assets/images/all.png|All of these",
    ],
    a: 1,
  },

  {
    q: "Q5. The breathing in of air is called ______.",
    img: "../assets/images/breathing1.png",
    options: [
      "../assets/images/inhalation.png|Inhalation",
      "../assets/images/exhalation.png|Exhalation",
      "../assets/images/breathing.png|Breathing",
      "../assets/images/respiration.png|Respiration",
    ],
    a: 0,
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
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.7 },
    scalar: 0.8
  });
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

    // d.innerHTML = `<div class="option-img"><img src="${img}"></div>${String.fromCharCode(65 + i)}. ${text}`;
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
        smallConfetti();
        [...optEl.children].forEach((o) => {
          if (o !== d) o.classList.add("disabled");
        });

        speak("Correct");
        showPopup(true);
        nextBtn.disabled = false;

        if (answered.every((a) => a !== null)) setTimeout(showFinal, 1600);
      } else {
        speak("Wrong");
        showPopup(false);
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
    icon.textContent = "🎉";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "🥲";
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
  smallConfetti();
}

loadQuestion();
