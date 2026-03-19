const quizData = [
  {
    q: "1. ________ is the force that is applied to move things.",
    img: "../assets/images/MCQ-Q1.png",
    options: [
      "../assets/images/Fulcrum.png|Fulcrum",
      "../assets/images/Load.png|Load",
      "../assets/images/Effort.png|Effort",
      "../assets/images/Load_armmm.png|Load arm",
    ],
    a: 2, // Effort
  },

  {
    q: "2. A fishing rod is an example of ____________.",
    img: "../assets/images/MCQ-Q2.png",
    options: [
      "../assets/images/Class 3 leverr.png|class 3 lever",
      "../assets/images/Class 1 lever.png|class 1 lever",
      "../assets/images/class 2 leverr.png|class 2 lever",
      "../assets/images/Inclined plane.png|inclined plane",
    ],
    a: 0, // class 3 lever
  },

  {
    q: "3. ____________ is the ability to do work.",
    img: "../assets/images/MCQ-Q3.png",
    options: [
      "../assets/images/Pressure.png|Pressure",
      "../assets/images/Machine.png|Machine",
      "../assets/images/Force.png|Force",
      "../assets/images/Energy.png|Energy",
    ],
    a: 3, // Energy
  },

  {
    q: "4. A ____________ is an example of a complex machine.",
    img: "../assets/images/Complx-Machine.png",
    options: [
      "../assets/images/Flag-Pole.png|flag pole",
      "../assets/images/Bicycle.png|bicycle",
      "../assets/images/Bolt&Nut.png|bolt and nut",
      "../assets/images/Knifeak.png|knife",
    ],
    a: 1, // bicycle
  },

  {
    q: "5. The grooves in a screw are called ____________.",
    img: "../assets/images/MCQ-Q5.png",
    options: [
      "../assets/images/pitches.png|pitches",
      "../assets/images/Wheels.png|wheels",
      "../assets/images/Thread.png|threads",
      "../assets/images/axles.png|axles",
    ],
    a: 2, // threads
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

    const img = t.split("|")[0];
    const text = t.split("|")[1];

    d.innerHTML = `
<div class="option-img"><img src="${img}"></div>
<div class="option-text">${text}</div>`;

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
