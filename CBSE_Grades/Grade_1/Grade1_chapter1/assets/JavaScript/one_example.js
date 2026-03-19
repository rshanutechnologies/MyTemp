const quizData = [
  {
    q: "Q1: Which is a living thing?",
    img: "../assets/images/owq-1.png",
    options: [
      { img: "../assets/images/cat.png", text: "Cat" },
      { img: "../assets/images/rock.png", text: "Rock" },
    ],
    a: 0,
  },

  {
    q: "Q2: Which is a non-living thing?",
    img: "../assets/images/owq-2.png",
    options: [
      { img: "../assets/images/ftb-3.png", text: "Tree" },
      { img: "../assets/images/chair.png", text: "Chair" },
    ],
    a: 1,
  },

  {
    q: "Q3: Which is a natural living thing?",
    img: "../assets/images/owq-3.png",
    options: [
      { img: "../assets/images/dog.png", text: "Dog" },
      { img: "../assets/images/robot.png", text: "Robot" },
    ],
    a: 0,
  },

  {
    q: "Q4: Which is a human-made thing?",
    img: "../assets/images/owq-4.png",
    options: [
      { img: "../assets/images/books.png", text: "Books" },
      { img: "../assets/images/flowers.png", text: "Flowers" },
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

  q.options.forEach((opt, i) => {
    const d = document.createElement("div");
    d.className = "option";

    d.innerHTML = `<img src="${opt.img}"><div>${opt.text}</div>`;

    /* RESTORE PREVIOUS ANSWER STATE */

    if (answered[current] !== null) {
      if (i === q.a) {
        d.classList.add("correct");
      } else {
        d.classList.add("hide");
      }

      d.style.pointerEvents = "none";
      d.style.transform = "translateX(0)";
    }

    d.onclick = () => {
      if (answered[current] !== null) return;

      if (i === q.a) {
        answered[current] = i;
        score++;

        d.classList.add("correct");

        [...optEl.children].forEach((o) => {
          o.style.pointerEvents = "none";

          if (o !== d) {
            o.classList.add("hide");
          }

          o.style.transform = "translateX(0)";
        });

        speak("Correct");
        smallConfetti();
        showPopup(true);

        setTimeout(() => {
          if (current === quizData.length - 1) {
            showFinal();
          } else {
            nextBtn.disabled = false;
          }
        }, 1600);
      } else {
        d.classList.add("wrong-blink");
        setTimeout(() => {
          d.classList.remove("wrong-blink");
        }, 600);

        speak("Wrong");
        showPopup(false);
      }
    };

    optEl.appendChild(d);
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
