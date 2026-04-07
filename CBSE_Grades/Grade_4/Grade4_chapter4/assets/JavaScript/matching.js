const leftData = [
  {
    id: "1",
    text: "1. Humidity",
    match: "e",
    img: "../assets/images/humidity1.png",
  },
  {
    id: "2",
    text: "2. Ozone layer",
    match: "c",
    img: "../assets/images/ozone1.png",
  },
  {
    id: "3",
    text: "3. Transpiration",
    match: "d",
    img: "../assets/images/transpiration.png",
  },
  {
    id: "4",
    text: "4. Air pressure",
    match: "a",
    img: "../assets/images/air-pressure.png",
  },
  {
    id: "5",
    text: "5. Oxygen",
    match: "b",
    img: "../assets/images/oxygen.png",
  },
];

const rightData = [
  { match: "a", text: "It helps in filling medicine in a syringe." },
  { match: "b", text: "It is necessary to break down food and obtain energy." },
  { match: "c", text: "Absorbs the harmful ultraviolet rays." },
  { match: "d", text: "Evaporation of water from the leaves of plants." },
  { match: "e", text: "The amount of water vapour present in the air." },
];

let selectedLeft = null;
let matchesFound = 0;
let score = 0;
let connections = [];

const leftCol = document.getElementById("leftColumn");
const rightCol = document.getElementById("rightColumn");
const svg = document.getElementById("line-canvas");

function init() {
  leftCol.innerHTML = "";
  rightCol.innerHTML = "";

  leftData.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.dataset.match = item.match;

    div.innerHTML = `
      <img src="${item.img}" class="left-img">
      <span>${item.text}</span>
    `;

    div.onclick = () => {
      if (div.classList.contains("matched")) return;

      document
        .querySelectorAll(".left .item")
        .forEach((i) => i.classList.remove("active"));

      div.classList.add("active");
      selectedLeft = div;
    };

    leftCol.appendChild(div);
  });

  rightData.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.dataset.id = item.match;

    div.innerHTML = `<span>${item.text}</span>`;

    div.onclick = () => {
      if (!selectedLeft || div.classList.contains("matched")) return;

      if (selectedLeft.dataset.match === div.dataset.id) {
        handleMatch(selectedLeft, div);
      } else {
        speak("Wrong");
        div.classList.add("error");
        setTimeout(() => div.classList.remove("error"), 400);
      }
    };

    rightCol.appendChild(div);
  });
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

/* 🔥 SMALL CONFETTI (for each correct match) */
function smallConfetti() {
  confetti({
    particleCount: 50,
    spread: 80,
    origin: { y: 0.6 },
    zIndex: 5000
  });
}

/* 🔥 BIG CONFETTI (already exists, unchanged) */
function bigConfetti() {
  const duration = 500;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      zIndex: 5000
    });

    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      zIndex: 5000
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function handleMatch(leftEl, rightEl) {
  score++;

  leftEl.classList.add("matched");
  rightEl.classList.add("matched");
  leftEl.classList.remove("active");

  if (false) {
    const num = matchesFound + 1;
    leftEl.dataset.num = num;
    rightEl.dataset.num = num;
  } else {
    drawCurve(leftEl, rightEl);
    connections.push({ from: leftEl, to: rightEl });
  }

  selectedLeft = null;
  matchesFound++;
  speak("Correct");

  smallConfetti(); // 🎉🔥 added here

  if (matchesFound === leftData.length) {
    setTimeout(showFinal, 700);
  }
}

function drawCurve(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();
  const containerRect = svg.getBoundingClientRect();

  const x1 = rect1.right - containerRect.left;
  const y1 = rect1.top + rect1.height / 2 - containerRect.top;

  const x2 = rect2.left - containerRect.left;
  const y2 = rect2.top + rect2.height / 2 - containerRect.top;

  const cx = (x1 + x2) / 2;

  const pathData = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  path.setAttribute("d", pathData);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#22c55e");
  path.setAttribute("stroke-width", "4");
  path.setAttribute("stroke-linecap", "round");

  svg.appendChild(path);
}

function showFinal() {
  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${leftData.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);

  document.getElementById("finalPopup").style.display = "flex";

  // (optional) you can add bigConfetti(); here if needed
}

window.addEventListener("resize", () => {
  svg.innerHTML = "";

  if (window.innerWidth > 768) {
    connections.forEach((c) => drawCurve(c.from, c.to));
  }
});

init();