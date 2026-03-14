const quizData = [
  {
    question: "A _____________ has a long sticky tongue.",
    options: [
      {
        title: "Snake",
        emoji: "🐉",
        value: "Snake",
        border: "border-orange",
      },
      { title: "Rat", emoji: "🐀", value: "Rat", border: "border-green" },
      { title: "Frog", emoji: "🐸", value: "Frog", border: "border-blue" },
      {
        title: "Butterfly",
        emoji: "🦋",
        value: "Butterfly",
        border: "border-red",
      },
    ],
    answer: "Frog",
  },
  {
    question: "A butterfly _____________ nectar.",
    options: [
      {
        title: "Swallows",
        emoji: "😮",
        value: "Swallows",
        border: "border-orange",
      },
      { title: "Chews", emoji: "🦷", value: "Chews", border: "border-blue" },
      { title: "Sucks", emoji: "🍯", value: "Sucks", border: "border-green" },
      { title: "Drinks", emoji: "🥤", value: "Drinks", border: "border-red" },
    ],
    answer: "Sucks",
  },
  {
    question: "_____________ have the ability to sharpen their teeth.",
    options: [
      {
        title: "Rodents",
        emoji: "🐹",
        value: "Rodents",
        border: "border-orange",
      },
      { title: "Bears", emoji: "🐻", value: "Bears", border: "border-green" },
      { title: "Lions", emoji: "🦁", value: "Lions", border: "border-red" },
      { title: "Dogs", emoji: "🐶", value: "Dogs", border: "border-blue" },
    ],
    answer: "Rodents",
  },
  {
    question: "A _______________ laps up liquid with its long tongue.",
    options: [
      {
        title: "Dog",
        emoji: "🐶",
        value: "Dog",
        border: "border-orange",
      },
      {
        title: "Owl",
        emoji: "🦉",
        value: "Owl",
        border: "border-blue",
      },
      {
        title: "Elephant",
        emoji: "🐘",
        value: "Elephant",
        border: "border-green",
      },
      { title: "Camel", emoji: "🐪", value: "Camel", border: "border-red" },
    ],
    answer: "Dog",
  },
  {
    question: "A _____________ sucks blood.",
    options: [
      { title: "Snake", emoji: "🐉", value: "Snake", border: "border-blue" },
      { title: "Frog", emoji: "🐸", value: "Frog", border: "border-orange" },
      { title: "Leech", emoji: "🪱", value: "Leech", border: "border-green" },
      { title: "Spider", emoji: "🕷️", value: "Spider", border: "border-red" },
    ],
    answer: "Leech",
  },
];

const questionText = document.getElementById("questionText");
const optionsRow = document.getElementById("optionsRow");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");


// const popup = document.getElementById("popup");
// const popupText = document.getElementById("popupText");
const screen = document.querySelector(".screen");

let current = 0;
let score = 0;

const solved = new Array(quizData.length).fill(false);
const correctSelected = new Array(quizData.length).fill(null);

function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}
// function showPopup(html, final = false) {
//   popup.style.display = "flex";
//   popupText.className = final ? "popup-box popup-final" : "popup-box";
//   popupText.innerHTML = html;
//   if (!final) setTimeout(() => (popup.style.display = "none"), 1000);
// }





function updateNav() {
  prevBtn.disabled = current === 0;

  if (current < quizData.length - 1) {
    nextBtn.disabled = !solved[current]; // ✅ only after correct
  } else {
    nextBtn.disabled = true; // last question no next
  }
}

function applyLockedState() {
  if (!solved[current]) return;

  const correctValue = correctSelected[current];
  const cards = document.querySelectorAll(".option");

  cards.forEach((card) => {
    if (card.dataset.value === correctValue) {
      card.classList.add("correct");
    } else {
      card.classList.add("disabled");
    }
  });

  updateNav();
}

function loadQuestion() {
  const q = quizData[current];
  questionText.textContent = q.question;

  optionsRow.innerHTML = "";
  q.options.forEach((opt) => {
    const card = document.createElement("div");
    card.className = `option ${opt.border}`;
    card.dataset.value = opt.value;

    card.innerHTML = `
        <div class="opt-img">${opt.emoji}</div>
        <div class="opt-title">${opt.title}</div>
      `;

    card.addEventListener("click", () => handleAnswer(opt.value));
    optionsRow.appendChild(card);
  });

  
  updateNav();
  applyLockedState();
}

function lockOptions(correctValue) {
  const cards = document.querySelectorAll(".option");
  cards.forEach((card) => {
    if (card.dataset.value === correctValue) {
      card.classList.add("correct");
    } else {
      card.classList.add("disabled");
    }
  });
}

function handleAnswer(selected) {
  const q = quizData[current];
  if (solved[current]) return;

  if (selected === q.answer) {
    solved[current] = true;
    correctSelected[current] = selected;
    score++;

    lockOptions(selected);
    speak("Correct");
    showPopup(true)

    // showPopup(`
    //     <div class="popup-correct">
    //       <span class="check">✅ Correct</span>
    //       <span class="happy">😊</span>
    //       <div class="stars">${"⭐".repeat(current + 1)}</div>
    //     </div>
    //   `);

    updateNav();

    // ✅ Move train icon now (but stay on same question until Next click)
    // Train should move to NEXT wagon only when user clicks Next
    // so here we keep it on current wagon.

    // ✅ Only for last question (Q5), final popup auto
    if (current === quizData.length - 1) {
      setTimeout(() => showFinal(), 1600);
    }
  } else {
    speak("Wrong");
    showPopup(false);

    // showPopup(`
    //     <div class="popup-wrong">
    //       <span class="cross">❌ Wrong</span>
    //       <span class="sad">😢</span>
    //       <div class="tip">💡 You can do it!</div>
    //     </div>
    //   `);
  }
}

// function showFinalPopup() {
//   popup.classList.add("final-wide");

//   showPopup(
//     `
//       <div class="popup-final-content">
//         🎉 Congratulations!
//         <span class="emoji">🏆</span>
//         You finished the quiz!
//         <div class="final-score">Score: <b>${score} / ${quizData.length}</b></div>
//         <div class="stars">⭐⭐⭐⭐⭐</div>
//         <button class="restart" onclick="location.reload()">🔄Restart</button>
//       </div>
//     `,
//     true,
//   );
// }

nextBtn.addEventListener("click", () => {
  if (current < quizData.length - 1 && solved[current]) {
    current++;
    loadQuestion();
  }
});

prevBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    loadQuestion();
  }
});

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
  screen.style.zIndex = "0";
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
