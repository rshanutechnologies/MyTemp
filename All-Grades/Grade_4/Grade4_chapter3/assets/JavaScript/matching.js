let activeConcept = null;
let score = 0;
const total = 5;
function isMobile() {
  return window.innerWidth <= 768;
}
let matchNumber = 1;

/*  PROGRESS  */
// const progress = document.getElementById("progress");

// function stars() {
//   progress.innerHTML = "";

//   for (let i = 0; i < total; i++) {
//     const item = document.createElement("div");
//     item.className = "item";

//     if (i < score) {
//       item.classList.add("active");
//       item.textContent = "⭐";
//     } else {
//       item.classList.add("lock");
//       item.textContent = "🔒";
//     }

//     progress.appendChild(item);
//   }
// }

/* initial render */
// stars();

/* voice */
document.body.addEventListener("click", () => speechSynthesis.resume(), {
  once: true,
});

const svg = document.getElementById("lines");
let matches = {};

function getAnchor(el, side) {
  const r = el.getBoundingClientRect();
  const s = svg.getBoundingClientRect();

  return {
    x: side === "right" ? r.right - s.left : r.left - s.left,
    y: r.top + r.height / 2 - s.top,
  };
}

function drawLine(fromEl, toEl) {
  const a = getAnchor(fromEl, "right"); // concept → right edge
  const b = getAnchor(toEl, "left"); // option → left edge

  const dx = (b.x - a.x) * 0.5;

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  path.setAttribute(
    "d",
    `
      M ${a.x} ${a.y}
      C ${a.x + dx} ${a.y},
        ${b.x - dx} ${b.y},
        ${b.x} ${b.y}
    `,
  );

  path.classList.add("match-line");
  svg.appendChild(path);
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

/* select concept */
document.querySelectorAll(".concept").forEach((c) => {
  c.onclick = () => {
    if (c.classList.contains("matched")) return;

    document
      .querySelectorAll(".concept")
      .forEach((x) => x.classList.remove("active"));

    c.classList.add("active");
    activeConcept = c;
  };
});

/* select example */
document.querySelectorAll(".example").forEach((e) => {
  e.onclick = () => {
    if (!activeConcept || e.classList.contains("matched")) return;

    if (e.dataset.value === activeConcept.dataset.answer) {
     speak("Correct");

if (!isMobile()) {
  drawLine(activeConcept, e);
} else {
  // mobile numbers
  activeConcept.setAttribute("data-match", matchNumber);
  e.setAttribute("data-match", matchNumber);

  activeConcept.classList.add("numbered");
  e.classList.add("numbered");

  matchNumber++;
}

activeConcept.classList.add("matched");
e.classList.add("matched");

activeConcept.classList.remove("active");
activeConcept = null;
score++;
      // stars();

      if (score === total) setTimeout(showFinal, 800);
    } 
    
    else {
      speak("Wrong");
      e.classList.add("wrong");
      setTimeout(() => e.classList.remove("wrong"), 300);
    }
  };
});

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
