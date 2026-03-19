const quiz = [
  {
    q: "Q1. What is inhalation?",
    img1: "../assets/images/inhalation1.png",
    t1: "Breathing in air",
    img2: "../assets/images/exhalation2.png",
    t2: "Breathing out air",
    a: "breathing in air",
  },

  {
    q: "Q2. What is diaphragm?",
    img1: "../assets/images/diaphragm1.png",
    t1: "Muscle below lungs",
    img2: "../assets/images/heart3.png",
    t2: "Pumping organ",
    a: "muscle below lungs",
  },

  {
    q: "Q3. What is pulse rate?",
    img1: "../assets/images/pulse-rate.png",
    t1: "Heartbeat per minute",
    img2: "../assets/images/inhalation1.png",
    t2: "Breaths per minute",
    a: "heartbeat per minute",
  },

  {
    q: "Q4. What do capillaries carry through them?",
    img1: "../assets/images/blood.png",
    t1: "Blood",
    img2: "../assets/images/air.png",
    t2: "Air",
    a: "blood",
  },

  {
    q: "Q5. Name the four chambers of the heart.",
    img1: "../assets/images/heart-chambers1.png",
    t1: "Atrium and ventricle",
    img2: "../assets/images/lungs.png",
    t2: "Bronchi and alveoli",
    a: "atrium and ventricle",
  }
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
  confetti({
    particleCount: 35,
    spread: 70,
    origin: { y: 0.7 },
    scalar: 0.8
  });
}

function load() {
  const q = quiz[current];
  qEl.textContent = q.q;
  img1.src = q.img1;
  img2.src = q.img2;
  t1.textContent = q.t1;
  t2.textContent = q.t2;

  box1.classList.remove("correct", "wrong", "rotateCorrect");
  box2.classList.remove("correct", "wrong", "rotateCorrect");

  prev.disabled = current === 0;
  next.disabled = answers[current] === null;

  if (answers[current] !== null) {
    const correct = q.a;
    if (correct === q.t1.toLowerCase()) {
      box1.classList.add("correct");
      box2.classList.add("wrong");
    } else {
      box2.classList.add("correct");
      box1.classList.add("wrong");
    }
  }
}

function blinkWrong(box) {
  box.classList.add("wrongBlink");
  setTimeout(() => {
    box.classList.remove("wrongBlink");
  }, 350);
}

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";
  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "🥲";
    title.textContent = "Oops!";
    msg.textContent = "Try again, you can do it!";
  }
  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${quiz.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
  document.getElementById("finalPopup").style.display = "flex";
  smallConfetti();
}

function choose(choice) {
  if (answers[current] !== null) return;
  const q = quiz[current];
  let selected = choice === 1 ? q.t1.toLowerCase() : q.t2.toLowerCase();
  if (selected === q.a) {
    answers[current] = selected;
    score++;
    if (choice === 1) {
  box1.classList.add("correct","rotateCorrect");
  box2.classList.add("wrong");
} else {
  box2.classList.add("correct","rotateCorrect");
  box1.classList.add("wrong");
}
    speak("Correct");
    smallConfetti();
    showPopup(true);
    next.disabled = false;
    if (answers.every((a) => a !== null)) setTimeout(showFinal, 1600);
  } else {
    if (choice === 1) {
      blinkWrong(box1);
    } else {
      blinkWrong(box2);
    }
    speak("Wrong");
    showPopup(false);
  }
}

box1.onclick = () => choose(1);
box2.onclick = () => choose(2);
prev.onclick = () => {
  current--;
  load();
};
next.onclick = () => {
  current++;
  load();
};
load();
