const questions = [
  {
    q: "Q1.Which of the following is the main source of energy?",
    img: "../assets/images/mcq1-img.png",
    options: [
      { t: "Plants", img: "../assets/images/plants.png" },
      { t: "Animals", img: "../assets/images/cow.png" },
      { t: "Sun", img: "../assets/images/sun.png" },
      { t: "Chlorophyll", img: "../assets/images/Chlorophyll.png" },
    ],
    answer: 2,
  },

  {
    q: "Q2.The process by which a plant makes its own food in the presence of sunlight is called _____________ ?",
    img: "../assets/images/mcq2-img.png",
    options: [
      { t: "Venation", img: "../assets/images/Venation.png" },
      { t: "Photosynthesis", img: "../assets/images/Photosynthesis.png" },
      { t: "Respiration", img: "../assets/images/Respiration.png" },
      { t: "Phyllotaxy", img: "../assets/images/Phyllotaxy.png" },
    ],
    answer: 1,
  },

  {
    q: "Q3.Which of the following is the flat part of the leaf?",
    img: "../assets/images/mcq3-img.png",
    options: [
      { t: "Lamina", img: "../assets/images/lamina.png" },
      { t: "Apex", img: "../assets/images/apex.png" },
      { t: "Vein", img: "../assets/images/vein.png" },
      { t: "Chlorophyll", img: "../assets/images/Chlorophyll.png" },
    ],
    answer: 0,
  },

  {
    q: "Q4.Which of the following plants has spiral phyllotaxy?",
    img: "../assets/images/mcq4-img.png",
    options: [
      { t: "Guava", img: "../assets/images/Guava.png" },
      { t: "Pomegranate", img: "../assets/images/Pomegranate.png" },
      { t: "Sunflower", img: "../assets/images/Sunflower.png" },
      { t: "Neem", img: "../assets/images/neem.png" },
    ],
    answer: 3,
  },

  {
    q: "Q5.Which of the following has stored food in its stem?",
    img: "../assets/images/mcq5-img.png",
    options: [
      { t: "Cauliflower", img: "../assets/images/clouliflower.png" },
      { t: "Potato", img: "../assets/images/potato.png" },
      { t: "Spinach", img: "../assets/images/Spinach.png" },
      { t: "Carrot", img: "../assets/images/Carrot.png" },
    ],
    answer: 1,
  },
];

let current = 0;
let score = 0;
let answers = Array(questions.length).fill(null);
let solved = Array(questions.length).fill(false);

const qText = document.querySelector(".question");
const qImg = document.querySelector(".question-card img");
const options = document.querySelectorAll(".option-card");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const progress = document.querySelectorAll(".progress-segment");

function loadQuestion() {
  const q = questions[current];
  const qNo = document.querySelector(".q-no");
  const qTextSpan = document.querySelector(".q-text");

  // Remove Q1., Q2. etc from display text - show full question without number prefix
  const fullQuestionText = q.q;
  // Extract number part and rest
  const firstSpaceIndex = fullQuestionText.indexOf(' ');
  let numberPart = '';
  let questionBody = fullQuestionText;
  
  if (firstSpaceIndex !== -1 && fullQuestionText[0] === 'Q') {
    numberPart = fullQuestionText.substring(0, firstSpaceIndex);
    questionBody = fullQuestionText.substring(firstSpaceIndex + 1);
  } else {
    numberPart = `Q${current + 1}.`;
    questionBody = fullQuestionText;
  }
  
  qNo.textContent = numberPart;
  qTextSpan.textContent = questionBody;

  qImg.src = q.img;

  options.forEach((card, i) => {
    card.className = `option-card ${card.classList[1]}`;
    card.querySelector("span").textContent = q.options[i].t;
    const imgBox = card.querySelector("div");
    imgBox.innerHTML = `<img src="${q.options[i].img}" alt="">`;
    card.onclick = () => selectAnswer(i);

    if (answers[current] === i) {
      card.classList.add(solved[current] ? "correct" : "wrong");
    }

    if (solved[current]) {
      card.classList.add("disabled");
      if (i === q.answer) card.classList.add("correct");
    } else {
      card.classList.remove("disabled");
    }
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !solved[current];
  updateProgress();
}

function selectAnswer(i) {
  const correct = questions[current].answer;
  options.forEach((o) => o.classList.remove("correct", "wrong"));
  answers[current] = i;

  if (i === correct) {
    options[i].classList.add("correct");
    solved[current] = true;
    score++;
    updateProgress();
    speak("Correct");
    showPopup(true);
    options.forEach((o) => o.classList.add("disabled"));

    if (current === questions.length - 1) {
      setTimeout(showFinal, 1600);
    } else {
      nextBtn.disabled = false;
    }
  } else {
    const wrongCard = options[i];
    wrongCard.classList.add("blink-wrong");
    speak("Wrong!");
    showPopup(false);
    setTimeout(() => {
      wrongCard.classList.remove("blink-wrong");
    }, 600);
  }
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

prevBtn.onclick = () => {
  if (current > 0) {
    current--;
    loadQuestion();
  }
};

nextBtn.onclick = () => {
  if (current < questions.length - 1 && solved[current]) {
    current++;
    loadQuestion();
  }
};

function updateProgress() {
  progress.forEach((p, i) => {
    p.classList.toggle("active", solved[i]);
  });
}

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
  if (window.innerWidth >= 769 && typeof confetti === 'function') {
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
}

// Initialize the quiz
loadQuestion();