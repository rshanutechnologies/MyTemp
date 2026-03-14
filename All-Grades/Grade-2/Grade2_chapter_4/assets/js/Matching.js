let gameOver = false;

function speak(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

const total = 3;
let solved = 0;
let selectedLeft = null;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const grid = document.getElementById("grid");

function resizeCanvas() {
  canvas.width = grid.offsetWidth;
  canvas.height = grid.offsetHeight;
}
resizeCanvas();
window.onresize = resizeCanvas;

/* ---------------- PROGRESS ---------------- */
const progress = document.getElementById("progress");
function renderProgress() {
  progress.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const s = document.createElement("div");
    s.className = "step";
    if (i < solved) s.classList.add("correct");
    else if (i === solved) s.classList.add("active");
    s.textContent = i + 1;
    progress.appendChild(s);
  }
}
renderProgress();

/* ---------------- LEFT CLICK ---------------- */
document.querySelectorAll(".left").forEach((left) => {
  left.onclick = () => {
    if (gameOver) return;
    if (left.classList.contains("correct")) return;

    document
      .querySelectorAll(".left")
      .forEach((i) => i.classList.remove("selected"));
    left.classList.add("selected");
    selectedLeft = left;
  };
});

/* ---------------- RIGHT CLICK ---------------- */
document.querySelectorAll(".right").forEach((right) => {
  right.onclick = () => {
    if (gameOver) return;
    if (!selectedLeft) return;

    const match = selectedLeft.dataset.key === right.dataset.key;
    showPopup(match);

    if (!match) return;

    drawLine(selectedLeft, right);
    flyImage(selectedLeft, right);

    selectedLeft.classList.add("correct");
    right.classList.add("correct");

    solved++;
    renderProgress();

    if (solved === total) {
      setTimeout(showFinalPopup, 900);
    }

    selectedLeft.classList.remove("selected");
    selectedLeft = null;
  };
});

/* ---------------- DRAW LINE ---------------- */
function drawLine(left, right) {
  const l = left.getBoundingClientRect();
  const r = right.getBoundingClientRect();
  const g = grid.getBoundingClientRect();

  const x1 = l.right - g.left;
  const y1 = l.top + l.height / 2 - g.top;
  const x2 = r.left - g.left;
  const y2 = r.top + r.height / 2 - g.top;

  ctx.strokeStyle = left.dataset.color;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.bezierCurveTo(x1 + 80, y1, x2 - 80, y2, x2, y2);
  ctx.stroke();
}

/* ---------------- FLY IMAGE ---------------- */
function flyImage(left, right) {
  const fly = document.createElement("img");
  fly.src = left.dataset.img;
  fly.className = "fly-img";
  document.body.appendChild(fly);

  const start = left.querySelector("img").getBoundingClientRect();
  const end = right.querySelector(".slot").getBoundingClientRect();

  fly.style.left = start.left + "px";
  fly.style.top = start.top + "px";

  setTimeout(() => {
    fly.style.left = end.left + "px";
    fly.style.top = end.top + "px";
    fly.style.width = "42px";
    fly.style.height = "42px";
  }, 50);

  setTimeout(() => {
    right.querySelector(".slot").appendChild(fly);
    fly.style.position = "static";
  }, 900);
}

/* ---------------- POPUPS ---------------- */
const popup = document.getElementById("popup");
const popupEmoji = document.getElementById("popupEmoji");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");
const restartBtn = document.getElementById("restart");

function showPopup(ok) {
  popup.classList.remove("hidden");
  popupEmoji.textContent = ok ? "👍" : "👎";
  popupTitle.textContent = ok ? "Correct!" : "Try Again";
  popupText.textContent = ok ? "Good job!" : "Try again";
  speak(ok ? "Correct" : "Try again");

  setTimeout(() => {
    if (!gameOver) {
      popup.classList.add("hidden");
    }
  }, 1000);
}

/* ---------------- FINAL POPUP ---------------- */
function showFinalPopup() {
  gameOver = true;

  popup.classList.remove("hidden");
  popupEmoji.innerHTML = `
    <div class="final-board">
      <div class="pins">
        <span class="pin" style="animation-delay:.2s">🎯</span>
        <span class="pin" style="animation-delay:.5s">🎯</span>
        <span class="pin" style="animation-delay:.8s">🎯</span>
        <span class="pin" style="animation-delay:1.1s">🎯</span>
        <span class="pin" style="animation-delay:1.4s">🎯</span>
      </div>
    </div>`;
  popupTitle.textContent = "Congratulations!";
  popupText.textContent = `Score: ${solved}/${total}`;
  restartBtn.classList.remove("hidden");
}

restartBtn.onclick = () => location.reload();
