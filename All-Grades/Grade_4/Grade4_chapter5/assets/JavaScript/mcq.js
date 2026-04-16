const quizData = [
  {
    q: "Q1. Living things require ______ for breathing.",
    img: "../assets/images/boy-img.png",
    options: [
      { t: "argon", img: "../assets/images/Argon.png" },
      { t: "oxygen", img: "../assets/images/oxygen.png" },
      { t: "nitrogen", img: "../assets/images/Nitrogen.png" },
      { t: "carbon dioxide", img: "../assets/images/CO2.png" },
    ],
    a: 1,
  },
  {
    q: "Q2. ______ of the Earth is covered by water.",
    img: "../assets/images/earth-img.png",
    options: [
      { t: "80%", img: "../assets/images/80.png" },
      { t: "10%", img: "../assets/images/10.png" },
      { t: "70%", img: "../assets/images/70.png" },
      { t: "20%", img: "../assets/images/20.png" },
    ],
    a: 2,
  },
  {
    q: "Q3. The roots of trees and plants bind the soil preventing ______.",
    img: "../assets/images/tree-img.png",
    options: [
      { t: "soil erosion", img: "../assets/images/soil-img.png" },
      { t: "minerals", img: "../assets/images/minerals.png" },
      { t: "oxygen", img: "../assets/images/oxygen.png" },
      { t: "pollution", img: "../assets/images/polutions.png" },
    ],
    a: 0,
  },
  {
    q: "Q4. ______ is refined to make petrol or diesel.",
    img: "../assets/images/oil-img.png",
    options: [
      { t: "Dead plant", img: "../assets/images/dead-plant.png" },
      { t: "Crude oil", img: "../assets/images/crude-oil.png" },
      { t: "Fossil fuel", img: "../assets/images/fossil-img1.png" },
      { t: "Metal", img: "../assets/images/metal-img.png" },
    ],
    a: 2,
  },
  {
    q: "Q5. A ______ is a large area which is almost covered with woody vegetation or trees.",
    img: "../assets/images/forest-img.png",
    options: [
      { t: "plant", img: "../assets/images/plant.png" },
      { t: "forest", img: "../assets/images/forest.png" },
      { t: "soil", img: "../assets/images/soil.png" },
      { t: "fossil", img: "../assets/images/fossil-img1.png" },
    ],
    a: 1,
  },
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const questionImg = document.getElementById("questionImg");
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

function loadQuestion() {
  const q = quizData[current];
  questionEl.textContent = q.q;
  questionImg.src = q.img;
  optionsEl.innerHTML = "";

  q.options.forEach((o, i) => {
    const div = document.createElement("div");
    div.className = "option";
    // div.innerHTML = `<span>${o.t}</span>`;
div.innerHTML = `
  <div class="option-content">
    <img src="${o.img}" class="option-img">
    <span>${o.t}</span>
  </div>
`;
    // ✅ RESTORE STATE if already answered
    if (answered[current] !== null) {
      if (i === q.a) {
        div.classList.add("correct");
      } else {
        div.classList.add("disabled");
      }
    }

    div.onclick = () => {
      if (answered[current] !== null) return;

      if (i === q.a) {
        answered[current] = i;
        score++;
        speak("Correct");
        showPopup(true);

        div.classList.add("correct");
        [...optionsEl.children].forEach((el, idx) => {
          if (idx !== q.a) el.classList.add("disabled");
        });

        nextBtn.disabled = false;

        if (answered.every((a) => a !== null)) {
          setTimeout(showFinal, 1600);
        }
      } else {
        speak("Wrong");
        showPopup(false);
      }
    };

    optionsEl.appendChild(div);
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = answered[current] === null;
}

prevBtn.onclick = () => {
  current--;
  loadQuestion();
};
nextBtn.onclick = () => {
  current++;
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

loadQuestion();
