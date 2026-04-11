const leftItems = [
  { text: "Tiger", img: "../assets/images/MCQ_2.png" },
  { text: "Bear", img: "../assets/images/bear.png" },
  { text: "Elephant", img: "../assets/images/MCQ_3_1.png" },
  { text: "Crocodile", img: "../assets/images/M-5.png" },
];

const rightItems = [
  { text: "Herbivore", img: "../assets/images/MCQ_3_1.png" },
  { text: "Aquatic animal", img: "../assets/images/M-5.png" },
  { text: "Carnivore", img: "../assets/images/M-2.png" },
  { text: "Omnivore", img: "../assets/images/bear.png" },
];

const answers = {
  Tiger: "Carnivore",
  Bear: "Omnivore",
  Elephant: "Herbivore",
  Crocodile: "Aquatic animal",
};

let selectedLeft = null,
  selectedRight = null,
  score = 0,
  matched = 0;
let popupTimer = null;

const leftCol = document.getElementById("leftCol");
const rightCol = document.getElementById("rightCol");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const levels = document.querySelectorAll(".level");

/* START FIRST BUBBLE */
levels[0].classList.add("current");

/* SPEECH */
function speak(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

/* LOAD ITEMS */
rightItems.sort(() => Math.random() - 0.5);

leftItems.forEach((obj) => {
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `<img src="${obj.img}">${obj.text}`;
  div.dataset.img = obj.img;
  div.dataset.text = obj.text;
  div.onclick = () => selectLeft(div);
  leftCol.appendChild(div);
});

rightItems.forEach((obj) => {
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `${obj.text}`; // ❌ removed image
  div.dataset.text = obj.text;
  div.onclick = () => selectRight(div);
  rightCol.appendChild(div);
});

function selectLeft(el) {
  if (el.classList.contains("correct")) return;
  document
    .querySelectorAll("#leftCol .item")
    .forEach((i) => i.classList.remove("selected"));
  el.classList.add("selected");
  selectedLeft = el;
  checkMatch();
}

function selectRight(el) {
  if (el.classList.contains("correct")) return;
  document
    .querySelectorAll("#rightCol .item")
    .forEach((i) => i.classList.remove("selected"));
  el.classList.add("selected");
  selectedRight = el;
  checkMatch();
}

/* FIXED IMAGE FLY */
function flyImage(src) {
  const targetIndex = matched;

  const clone = document.createElement("img");
  clone.src = src;
  clone.className = "fly";
  clone.style.width = "80px";
  clone.style.left = "50%";
  clone.style.top = "50%";
  document.body.appendChild(clone);

  const t = levels[targetIndex].getBoundingClientRect();

  setTimeout(() => {
    clone.style.left = t.left + "px";
    clone.style.top = t.top + "px";
    clone.style.width = "60px";
  }, 10);

  setTimeout(() => {
    levels[targetIndex].innerHTML = `<img src="${src}">`;
    levels[targetIndex].classList.add("active");

    levels.forEach((l) => l.classList.remove("current"));
    if (levels[targetIndex + 1])
      levels[targetIndex + 1].classList.add("current");

    document.body.removeChild(clone);
  }, 900);
}

/* MATCH CHECK */
function checkMatch() {
  if (!selectedLeft || !selectedRight) return;

  if (answers[selectedLeft.dataset.text] === selectedRight.dataset.text) {
    selectedLeft.classList.add("correct");
    selectedRight.classList.add("correct");

    // ✅ ADD LABEL
   const label = document.createElement("div");
label.className = "matched-label";
label.innerText = "Matched with: " + selectedRight.dataset.text;

selectedLeft.appendChild(label);

    speak("Correct");
    showPopup("✅ Correct!", "correct");

    flyImage(selectedLeft.dataset.img);

    score++;
    matched++;

    if (matched === 4) {
      setTimeout(() => {
        popup.style.display = "flex";
        popupText.className = "popup-box final";

        popupText.innerHTML = `
          🎉 Congratulations!
          <div style="margin-top:10px;font-size:22px;font-weight:600;text-align:center">
          Score: ${score}/4
          </div>

          <button id="restartBtn"
          style="
          margin-top:15px;
          padding:10px 20px;
          border:none;
          border-radius:20px;
          background:#28a745;
          color:#fff;
          font-size:16px;
          font-weight:bold;
          cursor:pointer;
          display:block;
          margin-inline:auto;
          ">
          🔄 Play Again
          </button>
          `;

        document
          .getElementById("restartBtn")
          .addEventListener("click", restartQuiz);

        startConfetti();
        startConfetti();
      }, 1000);
    }
  } else {
    speak("Try again");
    showPopup("❌ Try Again", "wrong");
  }

  selectedLeft.classList.remove("selected");
  selectedRight.classList.remove("selected");
  selectedLeft = null;
  selectedRight = null;
}

function restartQuiz() {
  clearInterval(confettiInterval);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  popup.style.display = "none";

  score = 0;
  matched = 0;
  selectedLeft = null;
  selectedRight = null;

  leftCol.innerHTML = "";
  rightCol.innerHTML = "";

  /* reset progress bubbles */
  levels.forEach((l) => {
    l.classList.remove("active", "current");
    l.innerHTML = "";
  });

  levels[0].classList.add("current");

  /* reshuffle right items */
  rightItems.sort(() => Math.random() - 0.5);

  /* rebuild left column */
  leftItems.forEach((obj) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<img src="${obj.img}">${obj.text}`;
    div.dataset.img = obj.img;
    div.dataset.text = obj.text;
    div.onclick = () => selectLeft(div);
    leftCol.appendChild(div);
  });

  /* rebuild right column */
  rightItems.forEach((obj) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = obj.text;
    div.dataset.text = obj.text;
    div.onclick = () => selectRight(div);
    rightCol.appendChild(div);
  });
}

/* POPUP */
function showPopup(text, type) {
  clearTimeout(popupTimer);
  popup.style.display = "flex";
  popupText.className = "popup-box " + type;
  popupText.innerHTML = text;

  if (type !== "final") {
    popupTimer = setTimeout(() => (popup.style.display = "none"), 1000);
  }
}

/* CONFETTI */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
let pieces = Array.from({ length: 150 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 6 + 2,
  d: Math.random() * 150,
  color: `hsl(${Math.random() * 360},100%,50%)`,
}));

let confettiInterval;
function startConfetti() {
  clearInterval(confettiInterval);

  confettiInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach((p) => {
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      p.y += Math.cos(p.d) + 1;
      p.x += Math.sin(p.d);

      if (p.y > canvas.height) p.y = 0;
    });
  }, 20);
}
