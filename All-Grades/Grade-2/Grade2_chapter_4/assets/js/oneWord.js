function speak(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

const questions = [
  {
    q: "Small and bushy plants",
    img: "../assets/images/O-1.png",
    options: [
      { text: "Shrubs", img: "../assets/images/shrub.png" },
      { text: "Trees", img: "../assets/images/tree.png" },
    ],
    answer: 0,
  },
  {
    q: "Small plants with soft stems",
    img: "../assets/images/O-2.png",
    options: [
      { text: "Herbs", img: "../assets/images/herb.png" },
      { text: "Shrubs", img: "../assets/images/shrub.png" },
    ],
    answer: 0,
  },
  {
    q: "Plants that creep along the ground",
    img: "../assets/images/O-3.png",
    options: [
      { text: "Creepers", img: "../assets/images/creeper.png" },
      { text: "Climbers", img: "../assets/images/climber.png" },
    ],
    answer: 0,
  },
  {
    q: "Grains such as wheat and rice",
    img: "../assets/images/O-4.png",
    options: [
      { text: "Cereals", img: "../assets/images/crops.png" },
      { text: "Herbs", img: "../assets/images/herb.png" },
    ],
    answer: 0,
  },
  {
    q: "We get sugar from this plant",
    img: "../assets/images/O-5.png",
    options: [
      { text: "Sugarcane", img: "../assets/images/sugarcane.png" },
      { text: "Cotton", img: "../assets/images/cotton.png" },
    ],
    answer: 0,
  },
];

let index = 0;
let correct = Array(questions.length).fill(false);
let finished = false;

const qText = document.getElementById("questionText");
const qImg = document.getElementById("questionImg");
const optEl = document.getElementById("options");
const progress = document.getElementById("progress");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

function renderProgress() {
  progress.innerHTML = "";
  questions.forEach((_, i) => {
    const s = document.createElement("div");
    s.className = "step";
    if (i === index) s.classList.add("active");
    if (correct[i]) s.classList.add("correct");
    s.textContent = i + 1;
    progress.appendChild(s);
  });
}

function render() {
  const q = questions[index];
  qText.textContent = q.q;
  qImg.src = q.img;
  optEl.innerHTML = "";
  nextBtn.disabled = !correct[index];

  q.options.forEach((o, i) => {
    const d = document.createElement("div");
    d.className = "option";

    d.innerHTML = `
    <img src="${o.img}" style="width:70px;height:70px;object-fit:contain;">
    <div style="margin-top:8px;font-weight:600;">${o.text}</div>
  `;

    if (correct[index]) {
      if (i === q.answer) d.classList.add("correct");
      d.style.pointerEvents = "none";
    } else {
      d.onclick = () => choose(i);
    }
    optEl.appendChild(d);
  });

  renderProgress();
}

function choose(i) {
  const q = questions[index];
  const options = document.querySelectorAll(".option");
  const clicked = options[i];
  const right = i === q.answer;

  if (right) {
    // CORRECT
    clicked.classList.add("correct");
    options.forEach((opt) => (opt.style.pointerEvents = "none"));
    correct[index] = true;
    nextBtn.disabled = false;
    showPopup(true);

    if (index === questions.length - 1) {
      setTimeout(showFinalPopup, 1000);
    }
  } else {
    // WRONG
    clicked.classList.add("wrong");
    options.forEach((opt) => (opt.style.pointerEvents = "none"));
    showPopup(false);

    // 🔁 return to normal after popup
    setTimeout(() => {
      clicked.classList.remove("wrong");
      options.forEach((opt) => (opt.style.pointerEvents = "auto"));
    }, 1200);
  }
}

function showPopup(ok) {
  popup.classList.remove("hidden");
  popupEmoji.textContent = ok ? "👍" : "👎";
  popupTitle.textContent = ok ? "Correct!" : "Try Again";
  popupText.textContent = ok ? "Good job!" : "That was not correct";
  speak(ok ? "Correct" : "Try again");

  setTimeout(() => {
    if (!finished) popup.classList.add("hidden");
  }, 1200);
}

function showFinalPopup() {
  finished = true;
  popup.classList.remove("hidden");
  popupEmoji.innerHTML = `<div class="final-board"><div class="pins">
    <span class="pin">🎯</span>
    <span class="pin">🎯</span>
    <span class="pin">🎯</span>
    <span class="pin">🎯</span>
    <span class="pin">🎯</span>
  </div></div>`;
  popupTitle.textContent = "Congratulations!";
  popupText.textContent = `Score: ${correct.filter(Boolean).length}/${questions.length}`;
  restart.classList.remove("hidden");
}

next.onclick = () => {
  if (index < questions.length - 1) {
    index++;
    render();
  }
};

prev.onclick = () => {
  if (index > 0) {
    index--;
    render();
  }
};

restart.onclick = () => location.reload();

render();
