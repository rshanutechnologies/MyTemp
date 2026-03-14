const data = [
  {
    q: "Which animal is called 'the ship of the desert?",
    img: "../assets/images/mcq1.png",
    correct: "Camel",
    options: [
      { t: "Lizard", e: "🦎" },
      { t: "Camel", e: "🐫" },
      { t: "Scorpion", e: "🦂" },
      { t: "Kangaroo rat", e: "🐭" },
    ],
  },

  {
    q: " ________ animals have streamlined bodies?",
    img: "../assets/images/fish-img.png",
    correct: "Aquatic",
    options: [
      { t: "Terrestrial", e: "🌍" },
      { t: "Aquatic", e: "💦" },
      { t: "Desert", e: "🏜️" },
      { t: "Arboreal", e: "🌳" },
    ],
  },

  {
    q: "Which is not an adaptive feature of a polar bear to live in extreme climatic conditions?",
    img: "../assets/images/bear-img.png",
    correct: "Broad eyes",
    options: [
      { t: "Small ears", e: "👂" },
      { t: "Wide and large paws", e: "🐾" },
      { t: "Strong sense of smell", e: "👃" },
      { t: "Broad eyes", e: "👀" },
    ],
  },

  {
    q: "Arboreal animals are mostly ________?",
    img: "../assets/images/monkey-img.png",
    correct: "herbivores",
    options: [
      { t: "carnivores", e: "🍖" },
      { t: "omnivores", e: "🍔" },
      { t: "herbivores", e: "🌿" },
      { t: "none of these", e: "❓" },
    ],
  },

  {
    q: "Which is not an example of an amphibian?",
    img: "../assets/images/mcq5-img.png",
    correct: "Monkey",
    options: [
      { t: "Monkey", e: "🐒" },
      { t: "Newt", e: "🦦" },
      { t: "Frog", e: "🐸" },
      { t: "Salamander", e: "🦎" },
    ],
  },
];

/* 🎨 COLOR PALETTE */
const optionColors = [
  {
    bg: "#e9f9ef",
    border: "#7fd6a2",
    shadow: "rgba(127,214,162,.6)",
    text: "#2f8f57",
  },
  {
    bg: "#ffeef2",
    border: "#ffb3c6",
    shadow: "rgba(255,179,198,.6)",
    text: "#d94b6a",
  },
  {
    bg: "#e8fbf4",
    border: "#7fded0",
    shadow: "rgba(127,222,208,.6)",
    text: "#1f8f78",
  },
  {
    bg: "#fff7e5",
    border: "#ffd36b",
    shadow: "rgba(255,211,107,.6)",
    text: "#b88912",
  },
  {
    bg: "#eef3ff",
    border: "#a5b8ff",
    shadow: "rgba(165,184,255,.6)",
    text: "#3d55c6",
  },
];

let idx = 0;
let score = 0;
let answered = new Array(data.length).fill(false);

const q = document.querySelector(".question");
const drop = document.querySelector(".drop");
const options = document.querySelector(".options");
const progress = document.querySelector(".progress");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

function stars() {
  progress.innerHTML = "";

  data.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "item";

    if (answered[i]) {
      d.classList.add("active");
      d.textContent = "⭐";
    } else {
      d.classList.add("lock");
      d.textContent = "🔒";
    }

    progress.appendChild(d);
  });
}

function load() {
  document.getElementById("qIndex").textContent = `Q${idx + 1}.`;
  document.getElementById("qText").textContent = data[idx].q;

  drop.className = "drop";

  if (answered[idx]) {
    drop.classList.add("correct");
    drop.querySelector(".drop-inner").textContent = data[idx].correct;
  } else {
    drop.querySelector(".drop-inner").textContent = "Drop your answer here";
  }

  document.getElementById("questionImg").src = data[idx].img;
  next.disabled = !answered[idx];
  options.innerHTML = "";
  stars();

  data[idx].options.forEach((o, i) => {
    const d = document.createElement("div");
    d.className = "option";
    d.draggable = !answered[idx];
    d.dataset.v = o.t;

    const c = optionColors[i % optionColors.length];
    d.style.background = c.bg;
    d.style.border = `2px solid ${c.border}`;
    d.style.color = c.text;
    // d.style.boxShadow = `inset 0 0 0 3px #fff, 0 6px 18px ${c.shadow}`;

    d.innerHTML = `
      <div style="font-size:28px;">${o.e}</div>
      <span>${o.t}</span>
    `;

    d.ondragstart = (e) => e.dataTransfer.setData("text", o.t);

    if (answered[idx]) {
      d.classList.add("locked");
      if (o.t === data[idx].correct) d.classList.add("correct");
    }

    options.appendChild(d);
  });

  prev.disabled = idx === 0;
}

drop.ondragover = (e) => e.preventDefault();
drop.ondrop = (e) => {
  e.preventDefault();
  if (answered[idx]) return;
  const v = e.dataTransfer.getData("text");
  if (v === data[idx].correct) {
    answered[idx] = true;
    drop.querySelector(".drop-inner").textContent = v;
    drop.classList.add("correct");

    if (idx === data.length - 1) {
      setTimeout(showFinal, 1600);
    } else {
      next.disabled = false;
    }

    document.querySelectorAll(".option").forEach((o) => {
      o.classList.add("locked");
      if (o.dataset.v === v) o.classList.add("correct");
    });
    score++;
    stars();
    speak("Correct");
    showPopup(true);
  } else {
    speak("Wrong");
    showPopup(false);
  }
};

function restartQuiz() {
  idx = 0;
  answered = new Array(data.length).fill(false);
  resultPopup.style.display = "none";
  load();
}

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

prev.onclick = () => {
  idx--;
  load();
};
next.onclick = () => {
  idx++;
  load();
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

load();
