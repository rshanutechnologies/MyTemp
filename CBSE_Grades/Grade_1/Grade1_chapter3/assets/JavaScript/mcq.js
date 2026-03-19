const quizData = [
  {
    q: "Q1. A cat is a ______.",
    img: "../assets/images/caat.png",
    options: [
      "../assets/images/pet-animals.png|pet animal",
      "../assets/images/wild-animals.png|wild animal",
      "../assets/images/water-animals.png|water animal",
      "../assets/images/insects.png|insect",
    ],
    a: 0,
  },

  {
    q: "Q2. ______ is a reptile.",
    img: "../assets/images/group1.png",
    options: [
      "../assets/images/cow.png|Cow",
      "../assets/images/lion.png|Lion",
      "../assets/images/crocodile.png|Crocodile",
      "../assets/images/fish.png|Fish",
    ],
    a: 2,
  },

  {
    q: "Q3. A horse lives in a ______.",
    img: "../assets/images/horse.png",
    options: [
      "../assets/images/coop.png|coop",
      "../assets/images/stable.png|stable",
      "../assets/images/kennel.png|kennel",
      "../assets/images/shed.png|shed",
    ],
    a: 1,
  },

  {
    q: "Q4. Animals that live in forests are called ______ animals.",
    img: "../assets/images/forest.png",
    options: [
      "../assets/images/wild-animals.png|wild",
      "../assets/images/pet-animals.png|pet",
      "../assets/images/domestic-animals.png|domestic",
      "../assets/images/water-animals.png|water",
    ],
    a: 0,
  },

  {
    q: "Q5. An ______ lives in water.",
    img: "../assets/images/water.png",
    options: [
      "../assets/images/octopus.png|octopus",
      "../assets/images/tiger.png|tiger",
      "../assets/images/elephant.png|elephant",
      "../assets/images/peacock.png|peacock",
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
