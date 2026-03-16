const correctSound = new Audio(
  "https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3",
);
const wrongSound = new Audio(
  "https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3",
);

function speakText(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  utter.volume = 0.25;
  utter.lang = "en-UK";
  window.speechSynthesis.speak(utter);
}

/* ✅ Drinking Quiz Data (5 Questions) */
const quizData = [
  {
    question: "Q1. __________ spread over the entire space they are kept in.",
    options: [
      {
        id: "a",
        label: "Solids",
        img: "../assets/images/solid.png",
        correct: false,
      },
      {
        id: "b",
        label: "Molecules",
        img: "../assets/images/Molecules.png",
        correct: false,
      },
      {
        id: "c",
        label: "Gases",
        img: "../assets/images/dk5.png",
        correct: true,
      },
      {
        id: "d",
        label: "Liquids",
        img: "../assets/images/dk4.png",
        correct: false,
      },
    ],
  },
  {
    question:
      "Q2. __________ has a definite mass, a definite volume but doesn’t have a definite shape.",
    options: [
      {
        id: "a",
        label: "Nitrogen",
        img: "../assets/images/Nitrogen.png",
        correct: false,
      },
      {
        id: "b",
        label: "Oxygen",
        img: "../assets/images/oxygen.png",
        correct: false,
      },
      {
        id: "c",
        label: "Kerosene",
        img: "../assets/images/Kerosene.png",
        correct: true,
      },
      {
        id: "d",
        label: "Carbon dioxide",
        img: "../assets/images/CO2.png",
        correct: false,
      },
    ],
  },
  {
    question:
      "Q3. __________ take the shape of the container they are poured in.",
    options: [
      {
        id: "a",
        label: "Solids",
        img: "../assets/images/solid.png",
        correct: false,
      },
      {
        id: "b",
        label: "Molecules",
        img: "../assets/images/Molecules.png",
        correct: false,
      },
      {
        id: "c",
        label: "Gases",
        img: "../assets/images/gases.png",
        correct: false,
      },
      {
        id: "d",
        label: "Liquids",
        img: "../assets/images/Liquids.png",
        correct: true,
      },
    ],
  },
  {
    question: "Q4. When water is cooled, it becomes __________.",
    options: [
      {
        id: "a",
        label: "Water vapour",
        img: "../assets/images/Watervapour.png",
        correct: false,
      },
      { id: "b", label: "Ice", img: "../assets/images/Ice.png", correct: true },
      {
        id: "c",
        label: "Gas",
        img: "../assets/images/gases.png",
        correct: false,
      },
      {
        id: "d",
        label: "Liquid",
        img: "../assets/images/Liquids.png",
        correct: false,
      },
    ],
  },
  {
    question: "Q5. Water exists in __________ state at room temperature.",
    options: [
      {
        id: "a",
        label: "Solid",
        img: "../assets/images/solid.png",
        correct: false,
      },
      {
        id: "b",
        label: "Liquid",
        img: "../assets/images/Liquids.png",
        correct: true,
      },
      {
        id: "c",
        label: "Gas",
        img: "../assets/images/gases.png",
        correct: false,
      },
      {
        id: "d",
        label: "Vapour",
        img: "../assets/images/Watervapour.png",
        correct: false,
      },
    ],
  },
];

let current = 0;
let score = 0;
const solvedMap = {};

const quizTitleEl = document.getElementById("quizTitle");
const questionTextEl = document.getElementById("questionText");
const optionsWrapEl = document.getElementById("optionsWrap");
const progressBoxesEl = document.getElementById("progressBoxes");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const popup = document.getElementById("popup");
const popupBox = document.getElementById("popupBox");

function showPopup(html, final = false) {
  popup.style.display = "flex";
  popupBox.className = final ? "popup-box popup-final" : "popup-box";
  popupBox.innerHTML = html;
  if (!final) setTimeout(() => (popup.style.display = "none"), 1000);
}

function renderQuestion() {
  const q = quizData[current];
  const solved = solvedMap[current]?.solved === true;
  const correctId = solvedMap[current]?.correctId || null;

  quizTitleEl.textContent = q.title;
  questionTextEl.textContent = q.question;

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !solved;

  optionsWrapEl.innerHTML = "";

  q.options.forEach((opt) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "option";

    optionDiv.innerHTML = `
  <img class="opt-img" src="${opt.img}" alt="${opt.label}">
  <div class="opt-label">${opt.label}</div>
`;

    if (solved) {
      optionDiv.classList.add("disabled");
      if (opt.id === correctId) {
        optionDiv.classList.remove("disabled");
        optionDiv.classList.add("correct-highlight");
      }
    }

    optionDiv.addEventListener("click", () => selectOption(opt));
    optionsWrapEl.appendChild(optionDiv);
  });
}

function selectOption(opt) {
  if (solvedMap[current]?.solved) return;

  if (opt.correct) {
    solvedMap[current] = { solved: true, correctId: opt.id };
    score++;

    speakText("Correct");
    correctSound.currentTime = 0;
    correctSound.play();

    /* ✅ CORRECT POPUP (same as True/False logic) */
    showPopup(`
      <div class="popup-correct">
        <span class="check">✅ Correct</span>
        <span class="happy">😊</span>
        <div class="stars">${"⭐".repeat(current + 1)}</div>
      </div>
    `);

    renderQuestion();

    /* ✅ FINAL POPUP */
    if (current === quizData.length - 1) {
      setTimeout(() => {
        const stars = "⭐".repeat(
          Math.max(1, Math.round((score / quizData.length) * 5)),
        );

        showPopup(
          `
          <div class="popup-final-content">
            🎉 Congratulations!
            <span class="popup-emoji">🏆</span>
            <div class="final-score">
              Score: <b>${score} / ${quizData.length}</b>
            </div>
            <div class="stars">${stars}</div>
            <button class="restart" onclick="location.reload()">🔄 Restart</button>
          </div>
        `,
          true,
        );
      }, 1100);
    }
  } else {
    speakText("Wrong");
    wrongSound.currentTime = 0;
    wrongSound.play();

    /* ❌ WRONG POPUP (same style) */
    showPopup(`
      <div class="popup-wrong">
        <span class="cross">❌ Wrong</span>
        <span class="sad">😢</span>
        <div class="tip">💡 You can do it!</div>
      </div>
    `);
  }
}

prevBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (!solvedMap[current]?.solved) return;
  if (current < quizData.length - 1) {
    current++;
    renderQuestion();
  }
});

renderQuestion();
