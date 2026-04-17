const questions = [
  {
    q: "Q.1 Which of the following is not a part of the circulatory system?",
    options: [
      ["Heart", "../assets/images/heart1.png"],
      ["Windpipe", "../assets/images/windpipe.png"],
      ["Blood", "../assets/images/blood.png"],
      ["Blood Vessels", "../assets/images/blood-vessels.png"],
    ],
    answer: 1,
  },

  {
    q: "Q.2 The dome-shaped muscular organ located below the lungs is the?",
    options: [
      ["Heart", "../assets/images/heart1.png"],
      ["Diaphragm", "../assets/images/diaphragm.png"],
      ["Bronchi", "../assets/images/bronchi.png"],
      ["None of these", "../assets/images/not.png"],
    ],
    answer: 1,
  },

  {
    q: "Q.3 The average heart beat per minute in an adult is?",
    options: [
      ["12", "../assets/images/heart12.png"],
      ["60", "../assets/images/heart60.png"],
      ["30", "../assets/images/heart30.png"],
      ["72", "../assets/images/heart72.png"],
    ],
    answer: 3,
  },

  {
    q: "Q.4 The carries blood back from different parts of the body to the heart?",
    options: [
      ["Arteries", "../assets/images/arteries.png"],
      ["Veins", "../assets/images/veins.png"],
      ["Capillaries", "../assets/images/capillaries.png"],
      ["All of these", "../assets/images/aot.png"],
    ],
    answer: 1,
  },

  {
    q: "Q.5 The breathing in of air is called?",
    options: [
      ["Inhalation", "../assets/images/inhalation.png"],
      ["Exhalation", "../assets/images/exhalation.png"],
      ["Breathing", "../assets/images/breathing.png"],
      ["Respiration", "../assets/images/respiration.png"],
    ],
    answer: 0,
  },
];

let current = 0;
let score = 0;

let answers = Array(questions.length).fill(null);
let solved = Array(questions.length).fill(false);

const qText = document.querySelector(".question-card h2");

const options = document.querySelectorAll(".option-card");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

/* Progress container */
// const progressContainer = document.getElementById("progress");

/* ---------- LOAD QUESTION ---------- */
function loadQuestion() {
  const q = questions[current];
  qText.textContent = q.q;

  options.forEach((card, i) => {
    card.className = "option-card";
    card.querySelector("span").textContent = q.options[i][0];
    card.querySelector(".emoji img").src = q.options[i][1];

    card.onclick = () => selectAnswer(i);

    // ✅ If question already solved
    if (solved[current]) {
      if (i !== q.answer) {
        // ❌ Disable only wrong options
        card.classList.add("disabled");
      }
      // ✅ Correct option remains clickable
    }
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !solved[current];

  // renderProgress();
}

/* ---------- SPEECH ---------- */
// function speak(text) {
//   if (!("speechSynthesis" in window)) return;
//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(text));
// }

function speak(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25; // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

/* ---------- ANSWER ---------- */
// function selectAnswer(i) {
//   if (solved[current]) return;

//   const correct = questions[current].answer;
//   answers[current] = i;

//   if (i === correct) {
//     solved[current] = true;
//     score++;

//     // options[i].classList.add("correct");
//     options.forEach(o => o.classList.add("disabled"));

//     speak("Correct");
//     showPopup(true);

//     nextBtn.disabled = false;
//     renderProgress();

//     if (current === questions.length - 1)
//       setTimeout(showFinal, 1500);
//   } else {
//     const card = options[i];
//     card.classList.add("wrong", "blink");

//     speak("Wrong");
//     showPopup(false);

//     setTimeout(() => {
//       card.classList.remove("wrong", "blink");
//     }, 600);
//   }
// }

function selectAnswer(i) {
  if (solved[current]) return;

  const correct = questions[current].answer;

  if (i === correct) {
    solved[current] = true;
    score++;

    // ✅ Disable all options (no green highlight)
    options.forEach((o) => o.classList.add("disabled"));

    speak("Correct");
    showPopup(true);

    nextBtn.disabled = false;
    // renderProgress();

    if (current === questions.length - 1) setTimeout(showFinal, 1500);
  } else {
    // ❌ Only disable wrong option
    const card = options[i];
    card.classList.add("disabled");

    speak("Wrong");
    showPopup(false);
  }
}

/* ---------- PROGRESS BAR ---------- */
// function renderProgress() {
//   progressContainer.innerHTML = "";

//   questions.forEach((_, i) => {
//     const step = document.createElement("div");
//     step.className = "station";

//     if (solved[i]) step.classList.add("done");
//     if (i === current) step.classList.add("active");

//     if (i === questions.length - 1) {
//       step.classList.add("finish");
//       step.textContent = "🏁";
//     } else {
//       step.textContent = i + 1;
//     }

//     progressContainer.appendChild(step);
//   });
// }

/* ---------- NAVIGATION ---------- */
prevBtn.onclick = () => {
  if (current > 0) {
    current--;
    loadQuestion();
  }
};

nextBtn.onclick = () => {
  if (current < questions.length - 1) {
    current++;
    loadQuestion();
  }
};

/* ---------- POPUPS ---------- */
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

  icon.textContent = isCorrect ? "🎉" : "😔";
  title.textContent = isCorrect ? "Correct!" : "Wrong!";
  msg.textContent = isCorrect ? "Well done!" : "Try again!";

  setTimeout(() => (popup.style.display = "none"), 1200);
}

/* ---------- FINAL ---------- */
function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${questions.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
}

/* ---------- START ---------- */
loadQuestion();
