const quizData = [
  {
    q: "1. Which animal is called 'the ship of the desert'?",
    img: "../images/MCQ-1.png",
    options: [
      "../images/mcq1-1.png|Lizard",
      "../images/mcq1-2.png|Camel",
      "../images/mcq1-3.png|Scorpion",
      "../images/mcq1-4.png|Kangaroo rat",
    ],
    a: 1,
  },

  {
    q: "2. ___________ animals have streamlined bodies.",
    img: "../images/MCQ-2.png",
    options: [
      "../images/mcq2-1.png|Terrestrial",
      "../images/FIB-3.png|Aquatic",
      "../images/MCQ-1.png|Desert",
      "../images/mcq2-4.png|Arboreal",
    ],
    a: 1,
  },

  {
    q: "3. Which is not an adaptive feature of a polar bear to live in extreme climatic conditions?",
    img: "../images/MCQ2.png",
    options: [
      "../images/mcq3-1.png|Small ears",
      "../images/mcq3-2.png|Wide and large paws",
      "../images/mcq3-3.png|Strong sense of smell",
      "../images/mcq3-4.png|Broad eyes",
    ],
    a: 3,
  },

  {
    q: "4. Arboreal animals are mostly ___________.",
    img: "../images/MCQ-4.png",
    options: [
      "../images/mcq4-1.png| carnivores",
      "../images/mcq4-2.png|omnivores",
      "../images/mcq4-3.png|herbivore",
      "../images/mcq4-4.png| scavengers",
    ],
    a: 2,
  },

  {
    q: "5. Which of these is the ability of an animal to blend with the surroundings?",
    img: "../images/MCQ5.png",
    options: [
      "../images/mcq5-1.png|Camouflage",
      "../images/mcq5-2.png|Hibernation",
      "../images/mcq5-3.png|Migration ",
      "../images/mcq5-4.png|Aestivation",
    ],
    a: 0,
  }
];
let isLocked = false;
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
  const duration = 500;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function loadQuestion() {
  const q = quizData[current];
  qEl.textContent = q.q;
  imgEl.src = q.img;
  optEl.innerHTML = "";
  nextBtn.disabled = answered[current] === null;

  q.options.forEach((t, i) => {
  const d = document.createElement("div");
  d.className = "option";

  const [img, text] = t.split("|");

  d.innerHTML = `
    <div class="option-img"><img src="${img}"></div>
    <div class="option-text">${text}</div>
  `;


  if (answered[current] !== null) {
    if (i === q.a) d.classList.add("correct");
    else d.classList.add("disabled");
  }
//     if (current === quizData.length - 1) {
//   isLocked = true;
// }
// if (answered.every((a) => a !== null)) {
//   isLocked = true; // lock ONLY when all answered
//   setTimeout(showFinal, 1600);
// }

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
      d.classList.add("wrong");

      setTimeout(() => {
        d.classList.remove("wrong");
      }, 700);

      speak("Wrong");
      showPopup(false);
    }
  };

  optEl.appendChild(d);
});

  prevBtn.disabled = current === 0;
}

// prevBtn.onclick = () => {
//   if (current === 0) return; // 🔥 stop at first
//   current--;
//   loadQuestion();
// };

// nextBtn.onclick = () => {
//   if (current === quizData.length - 1) return; // 🔥 stop at last
//   current++;
//   loadQuestion();
// };
prevBtn.onclick = () => {
  if (isLocked || current === 0) return;
  current--;
  loadQuestion();
};

nextBtn.onclick = () => {
  if (isLocked || current === quizData.length - 1) return;
  current++;
  loadQuestion();
};
prevBtn.disabled = current === 0;
nextBtn.disabled = current === quizData.length - 1 || answered[current] === null;
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
function restartQuiz() {
  current = 0;
  score = 0;
  answered = Array(quizData.length).fill(null);
  isLocked = false;

  document.getElementById("finalPopup").style.display = "none";

  loadQuestion();
}

function showFinal() {
  const popup = document.getElementById("finalPopup");
  document.getElementById("finalScore").textContent = `Your Score: ${score} / ${quizData.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
  popup.style.display = "flex";
  // ❌ remove isLocked = false from here
  bigConfetti();
}
loadQuestion();