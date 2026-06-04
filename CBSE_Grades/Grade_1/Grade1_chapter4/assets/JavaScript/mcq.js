const quizData = [
  {
    q: "Q1. Our body is divided into ______ main parts.",
    img: "../assets/images/mcq-1.png",
    options: [
      "../assets/images/one.png|One",
      "../assets/images/three.png|Three",
      "../assets/images/two.png|Two",
      "../assets/images/four.png|Four",
    ],
    a: 1,
  },

  {
    q: "Q2. We hear with our ______.",
    img: "../assets/images/mcq-2.png",
    options: [
      "../assets/images/nose.png|Nose",
      "../assets/images/ear.png|Ears",
      "../assets/images/skin1.png|Skin",
      "../assets/images/eye.png|Eyes",
    ],
    a: 1,
  },

  {
    q: "Q3. We must wash our hands with ______.",
    img: "../assets/images/mcq-3.png",
    options: [
      "../assets/images/soap.png|Soap and water",
      "../assets/images/oil.png|Oil",
      "../assets/images/perfume.png|Perfumes",
      "../assets/images/water.png|Milk and water",
    ],
    a: 0,
  },

  {
    q: "Q4. We should take bath ______.",
    img: "../assets/images/mcq-4.png",
    options: [
      "../assets/images/2.png|Twice in a week",
      "../assets/images/1.png|Once in a week",
      "../assets/images/3.png|Once in a month",
      "../assets/images/4.png|Every day",
    ],
    a: 3,
  },

  {
    q: "Q5. We should brush our teeth ______.",
    img: "../assets/images/mcq-5.png",
    options: [
      "../assets/images/once_day.png|Once in a day",
      "../assets/images/twice_week.png|Twice in a week",
      "../assets/images/once_month.png|Once in a month",
      "../assets/images/twice_day.png|Twice in a day",
    ],
    a: 3,
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
