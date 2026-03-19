const quiz = [
  {
    q: "Q1. An animal that has scales or hard shells on its body",
    img1: "../assets/images/turtle.png",
    t1: "Turtle",
    img2: "../assets/images/tf-1.png",
    t2: "Crab",
    a: "turtle",
  },

  {
    q: "Q2. An animal that lives in water",
    img1: "../assets/images/octopus.png",
    t1: "Octopus",
    img2: "../assets/images/elephant.png",
    t2: "Elephant",
    a: "octopus",
  },

  {
    q: "Q3. A wild animal",
    img1: "../assets/images/caaat.png",
    t1: "Cat",
    img2: "../assets/images/tiger.png",
    t2: "Tiger",
    a: "tiger",
  },

  {
    q: "Q4. A domestic animal",
    img1: "../assets/images/cow.png",
    t1: "Cow",
    img2: "../assets/images/crocodile.png",
    t2: "Crocodile",
    a: "cow",
  },

  {
    q: "Q5. A human-made shelter",
    img1: "../assets/images/house.png",
    t1: "House",
    img2: "../assets/images/cave1.png",
    t2: "Cave",
    a: "house",
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
  box1.classList.remove("correct", "wrong");
  box2.classList.remove("correct", "wrong");
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
  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${quiz.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
  document.getElementById("finalPopup").style.display = "flex";
  bigConfetti();
}

function choose(choice) {
  if (answers[current] !== null) return;
  const q = quiz[current];
  let selected = choice === 1 ? q.t1.toLowerCase() : q.t2.toLowerCase();
  if (selected === q.a) {
    answers[current] = selected;
    score++;
    if (choice === 1) {
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
