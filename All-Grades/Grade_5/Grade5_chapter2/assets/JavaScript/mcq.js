const quizData = [
  {
    q: "Q1. Which of the following statements best describes metamorphosis?",
    img: "../assets/images/mcq1-img.png",
    options: [
      {
        t: "Complete transformation from a caterpillar to an adult butterfly",
        cls: "blue",
        img: "🦋",
      },
      { t: "The caterpillar stage of a butterfly", cls: "orange", img: "🐛" },
      { t: "The process of producing young ones", cls: "green", img: "🐣" },
      { t: "The process of shedding the old skin", cls: "yellow", img: "🐍" },
    ],
    a: 0, // Option 1
  },
  {
    q: "Q2. The sequential development of an animal from the embryo to the adult stage is called its ________.",
    img: "../assets/images/mcq2-img.png",
    options: [
      { t: "Lifespan", cls: "blue", img: "⏳" },
      { t: "Life cycle", cls: "orange", img: "🔄" },
      { t: "Reproduction", cls: "green", img: "🐾" },
      { t: "None of these", cls: "yellow", img: "❌" },
    ],
    a: 1, // Option 2
  },
  {
    q: "Q3. The bird that lays the largest egg is the ________.",
    img: "../assets/images/x.png",
    options: [
      { t: "Crow", cls: "blue", img: "🐦" },
      { t: "Owl", cls: "orange", img: "🦉" },
      { t: "Ostrich", cls: "green", img: "🦤" },
      { t: "Peacock", cls: "yellow", img: "🦚" },
    ],
    a: 2, // Option 3
  },
  {
    q: "Q4. Find the odd one from the following.",
    img: "../assets/images/mcq4-img.png",
    options: [
      { t: "Kangaroo", cls: "blue", img: "🦘" },
      { t: "Rabbit", cls: "orange", img: "🐇" },
      { t: "Koala", cls: "green", img: "🐨" },
      { t: "Turtle", cls: "yellow", img: "🐢" },
    ],
    a: 3, // Option 4: Turtle (it lays eggs, others are mammals)
  },
  {
    q: "Q5. The white content of an egg or egg white is called ________.",
    img: "../assets/images/mcq5-img.png",
    options: [
      { t: "Shell", cls: "blue", img: "🐚" },
      { t: "Albumen", cls: "orange", img: "⚪" },
      { t: "Yolk", cls: "green", img: "🟡" },
      { t: "Pupa", cls: "yellow", img: "🐛" },
    ],
    a: 1, // Option 2
  },
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);

const qEl = document.getElementById("question");
const imgEl = document.getElementById("animalImg");
const optionsEl = document.getElementById("options");

const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// function speak(t) {
//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(t));
// }
  
function speak(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";  
  msg.volume = 0.25;   // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

function showPopup(msg, final = false) {
  popup.style.display = "flex";
  popupText.className = final ? "popup-box popup-final" : "popup-box";
  popupText.innerHTML = msg;
  if (!final) setTimeout(() => (popup.style.display = "none"), 1000);
}

function loadQuestion() {
  const q = quizData[current];
  qEl.textContent = q.q;
  imgEl.src = q.img;
  optionsEl.innerHTML = "";


  q.options.forEach((o, i) => {
    const div = document.createElement("div");
    div.className = `option ${o.cls}`;
    div.innerHTML = `<span>${o.img}</span>${o.t}`;
  
    div.dataset.index = i;
    div.innerHTML = `<span>${o.img}</span>${o.t}`;

    if (answered[current] !== null) {
      if (i === q.a) div.classList.add("correct");
      else div.classList.add("disabled");

      // TO THIS:
      
    }
    div.onclick = () => {

  if (answered[current] !== null) return;

  if (i === q.a) {

    answered[current] = i;
    score++;
    speak("Correct");
    showPopup(true);

    div.classList.add("correct");

    [...optionsEl.children].forEach((el, index) => {
      if (index !== i) el.classList.add("disabled");
    });

    nextBtn.disabled = false;

    if (answered.every(x => x !== null)) {
      setTimeout(showFinal, 1500);
    }

  } else {

    speak("Wrong");
    showPopup(false);

    div.classList.add("disabled");

  }

};

 

    optionsEl.appendChild(div);
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

loadQuestion();
