const leftData = [
  { id: "1", text: "1. A terrestrial animal", match: "b" },
  { id: "2", text: "2. An aquatic animal", match: "c" },
  { id: "3", text: "3. An amphibian", match: "e" },
  { id: "4", text: "4. An aerial animal", match: "a" },
  { id: "5", text: "5. An arboreal animal", match: "d" },
];

const rightData = [
  { match: "a", text: "Vulture", img: "../images/vulture.png" },
  { match: "b", text: "Yak", img: "../images/Yak.png" },
  { match: "c", text: "Dolphin", img: "../images/dolphin.png" },
  { match: "d", text: "Monkey", img: "../images/monkey.png" },
  { match: "e", text: "Newt", img: "../images/newt.png" },
];

let selectedLeft = null;
let matchesFound = 0;
let score = 0;
let connections = [];

const leftCol = document.getElementById("leftColumn");
const rightCol = document.getElementById("rightColumn");
const svg = document.getElementById("line-canvas");
const finalPopup = document.getElementById("finalPopup");

// Hide final popup on load
finalPopup.style.display = "none";

// ─── Init ─────────────────────────────────────────────────
function init() {
  leftCol.innerHTML = "";
  rightCol.innerHTML = "";

  leftData.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.dataset.match = item.match;
    div.innerHTML = `<span>${item.text}</span>`;

    div.onclick = () => {
      if (div.classList.contains("matched")) return;
      document.querySelectorAll(".left .item").forEach((i) => i.classList.remove("active"));
      div.classList.add("active");
      selectedLeft = div;
    };

    leftCol.appendChild(div);
  });

  rightData.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.dataset.id = item.match;
    div.innerHTML = `
      <img src="${item.img}" class="left-img">
      <span>${item.text}</span>
    `;

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

// ─── Speech ───────────────────────────────────────────────
function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

// ─── Confetti ─────────────────────────────────────────────
function smallConfetti() {
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  const duration = 500;
  const end = Date.now() + duration;
  (function frame() {
    confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// ─── Handle Match ─────────────────────────────────────────
function handleMatch(leftEl, rightEl) {
  score++;

  leftEl.classList.add("matched");
  rightEl.classList.add("matched");
  leftEl.classList.remove("active");

  const leftColor = window.getComputedStyle(leftEl).backgroundColor;
  rightEl.style.background = leftColor;

  drawCurve(leftEl, rightEl);
  connections.push({ from: leftEl, to: rightEl });

  selectedLeft = null;
  matchesFound++;

  speak("Correct");
  smallConfetti();

  if (matchesFound === leftData.length) {
    setTimeout(showFinal, 700);
  }
}

// ─── Draw Curve ───────────────────────────────────────────
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
  path.setAttribute("stroke-dasharray", "8 6");
  svg.appendChild(path);
}

// ─── Final Popup ──────────────────────────────────────────
function showFinal() {
  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${leftData.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
  // ✅ Use style.display directly, no .show class needed
  finalPopup.style.display = "flex";
  finalPopup.style.pointerEvents = "auto"; // ✅ Enable clicks
  bigConfetti();
}

// ─── Restart ──────────────────────────────────────────────
function restartQuiz() {
  // ✅ Reset all match variables
  selectedLeft = null;
  matchesFound = 0;
  score = 0;
  connections = [];

  // Clear SVG lines
  svg.innerHTML = "";

  // Hide final popup
  finalPopup.style.display = "none";
  finalPopup.style.pointerEvents = "none";

  // Re-build the board
  init();
}

// ─── Resize ───────────────────────────────────────────────
window.addEventListener("resize", () => {
  svg.innerHTML = "";
  connections.forEach((c) => drawCurve(c.from, c.to));
});

init();