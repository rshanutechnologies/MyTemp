const quiz = [
  {
    q: "Q1. Give one example of a big plant",
    img1: "../assets/images/mango1.png",
    t1: "Mango tree",
    img2: "../assets/images/rose1.png",
    t2: "Rose",
    a: "mango tree",
  },
  {
    q: "Q2. Give one example of a small plant",
    img1: "../assets/images/neem-branch.png",
    t1: "Neem",
    img2: "../assets/images/mint-leaves.png",
    t2: "Mint",
    a: "mint",
  },
  {
    q: "Q3. Give one example of a weak plant",
    img1: "../assets/images/pumpkin1.png",
    t1: "Pumpkin",
    img2: "../assets/images/tomato.png",
    t2: "Tomato",
    a: "pumpkin",
  },
  {
    q: "Q4. Give one example of a cereal",
    img1: "../assets/images/rice1.png",
    t1: "Rice",
    img2: "../assets/images/tf-2.png",
    t2: "Red gram",
    a: "rice",
  },
  {
    q: "Q5. Give one example of a vegetable",
    img1: "../assets/images/Carrot.png",
    t1: "Carrot",
    img2: "../assets/images/graps.png",
    t2: "Graps",
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

  if (answers[current] !== null) {
    if (q.a === q.t1.toLowerCase()) {
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

prev.onclick = () => {
  current--;
  load();
};
next.onclick = () => {
  current++;
  load();
};

function checkAnswer(selected) {
  const q = quiz[current];

  if (answers[current] !== null) return;

  if (selected === q.a) {
    answers[current] = selected;

    score++;

    if (selected === q.t1.toLowerCase()) {
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

    if (answers.every((a) => a !== null)) {
      setTimeout(showFinal, 1600);
    }
  } else {
    speak("Wrong");

    showPopup(false);
  }
}

box1.onclick=()=>{

   checkAnswer(
      quiz[current].t1.toLowerCase()
   );

};

box2.onclick=()=>{

   checkAnswer(
      quiz[current].t2.toLowerCase()
   );

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
