const quiz = [
  {
    q: "Q1. Give one example of a Big plant",
    img1: "../assets/images/mango.png",
    t1: "Mango Tree",
    img2: "../assets/images/rose.png",
    t2: "Rose",
    a: "mango tree",
  },
  {
    q: "Q2. Give one example of a Small plant",
    img1: "../assets/images/neem.png",
    t1: "Neem",
    img2: "../assets/images/mint.png",
    t2: "Mint",
    a: "mint",
  },
  {
    q: "Q3. Give one example of a Weak plant",
    img1: "../assets/images/pumpkin.png",
    t1: "Pumpkin",
    img2: "../assets/images/banyan-tree.png",
    t2: "Banyan Tree",
    a: "pumpkin",
  },
  {
    q: "Q4. Give one example of a Cereal",
    img1: "../assets/images/rice.png",
    t1: "Rice",
    img2: "../assets/images/apple.png",
    t2: "Apple",
    a: "rice",
  },
  {
    q: "Q5. Give one example of a Vegetable",
    img1: "../assets/images/carrot-img.png",
    t1: "Carrot",
    img2: "../assets/images/mango.png",
    t2: "Mango",
    a: "carrot",
  },
];

let current = 0;
let score = 0;
let answers = new Array(quiz.length).fill(null);

const qEl = document.getElementById("question");
const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");
const t1 = document.getElementById("text1");
const t2 = document.getElementById("text2");

const box1 = document.getElementById("box1");
const box2 = document.getElementById("box2");

const inputContainer = document.querySelector(".input-container");
const input = document.getElementById("answerInput");
const submit = document.getElementById("submitBtn");

const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");

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

function load() {
  const q = quiz[current];

  qEl.textContent = q.q;
  img1.src = q.img1;
  img2.src = q.img2;
  t1.textContent = q.t1;
  t2.textContent = q.t2;

  inputContainer.classList.remove("correct");
  input.value = answers[current] || "";
  input.disabled = answers[current] !== null;

  submit.disabled = !input.value.trim() || answers[current] !== null;

  box1.classList.remove("correct", "wrong");
  box2.classList.remove("correct", "wrong");

  if (answers[current] !== null) {
    inputContainer.classList.add("correct");
    const correct = q.a;

    if (correct === q.t1.toLowerCase()) {
      box1.classList.add("correct");
      box2.classList.add("wrong");
    } else {
      box2.classList.add("correct");
      box1.classList.add("wrong");
    }
  }

  prev.disabled = current === 0;
  next.disabled = answers[current] === null;
}

input.addEventListener("input", () => {
  submit.disabled = !input.value.trim();
});

input.addEventListener("dragover", (e) => {
  e.preventDefault();
});

input.addEventListener("drop", (e) => {
  e.preventDefault();
});
document.addEventListener("dragover", (e) => e.preventDefault());
document.addEventListener("drop", (e) => e.preventDefault());

submit.onclick = function () {
  const user = input.value.trim().toLowerCase();
  const q = quiz[current];
  const correct = q.a;

  if (user === correct) {
    answers[current] = user;
    score++;

    inputContainer.classList.add("correct");
    input.disabled = true;
    submit.disabled = true;

    if (correct === q.t1.toLowerCase()) {
      box1.classList.add("correct");
      box2.classList.add("wrong");
    } else {
      box2.classList.add("correct");
      box1.classList.add("wrong");
    }

    speak("Correct");
    smallConfetti();
    showPopup(true);

    next.disabled = false;

    if (answers.every((a) => a !== null)) setTimeout(showFinal, 1600);
  } else {
    speak("Wrong");
    showPopup(false);

    input.value = "";
    submit.disabled = true;
  }
};

prev.onclick = () => {
  current--;
  load();
};
next.onclick = () => {
  current++;
  load();
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
    `Your Score: ${score} / ${quiz.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
  popup.style.display = "flex";
  bigConfetti();
}

load();
