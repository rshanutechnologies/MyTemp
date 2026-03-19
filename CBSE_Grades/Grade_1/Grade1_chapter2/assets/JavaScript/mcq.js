const quizData = [
  {
    q: "Q1. Most of the ______ live for many years.",
    img: "../assets/images/mm-11.png",
    options: [
      "../assets/images/small-plants.png|small plants",
      "../assets/images/vegetables.png|vegetables",
      "../assets/images/tree.png|trees",
      "../assets/images/weak-plants.png|weak plants",
    ],
    a: 2,
  },

  {
    q: "Q2. ______ has a weak stem.",
    img: "../assets/images/mm-2.png",
    options: [
      "../assets/images/rose.png|Rose",
      "../assets/images/coconut.png|Coconut",
      "../assets/images/neem.png|Neem",
      "../assets/images/watermelon.png|Watermelon",
    ],
    a: 3,
  },

  {
    q: "Q3. Plants need ______ to grow.",
    img: "../assets/images/mm-3.png",
    options: [
      "../assets/images/water.png|water",
      "../assets/images/butter.png|butter",
      "../assets/images/eggs.png|eggs",
      "../assets/images/milk.png|milk",
    ],
    a: 0,
  },

  {
    q: "Q4. Plants that are tall and woody are called ______.",
    img: "../assets/images/mm-4.png",
    options: [
      "../assets/images/weak-plants.png|weak plants",
      "../assets/images/trees.png|trees",
      "../assets/images/small-plants.png|small plants",
      "../assets/images/grass.png|grass",
    ],
    a: 1,
  },

  {
    q: "Q5. ______ has thin and brown stem.",
    img: "../assets/images/mm-5.png",
    options: [
      "../assets/images/mango.png|Mango",
      "../assets/images/mint.png|Mint",
      "../assets/images/rose.png|Rose",
      "../assets/images/pumpkin.png|Pumpkin",
    ],
    a: 1,
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

    d.innerHTML = `<div class="option-img"><img src="${img}"></div>${String.fromCharCode(65 + i)}. ${text}`;

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
