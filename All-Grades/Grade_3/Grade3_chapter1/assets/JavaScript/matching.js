let selected = [];
let score = 0;

// const finish = document.getElementById("finish");

function isStep(el) {
  return el.classList.contains("step");
}

function isAnswer(el) {
  return el.classList.contains("answer");
}

document.querySelectorAll(".step,.answer").forEach((card) => {
  card.addEventListener("click", () => {
    if (card.classList.contains("correct")) return;

    // 🟢 FIRST CLICK → ONLY ANSWER (LEFT SIDE)
    if (selected.length === 0) {
      if (!isAnswer(card)) return;  // block step-first completely
      card.classList.add("selected");
      selected = [card];
      return;
    }

    // 🟡 SECOND CLICK
    if (selected.length === 1) {
      const first = selected[0];

      // ✅ Only allow matching if first was ANSWER and second is STEP
      if (isAnswer(first) && isStep(card)) {
        card.classList.add("selected");
        selected.push(card);
        check();
        return;
      }

      // 🔁 If clicking another ANSWER → switch selection
      if (isAnswer(card)) {
        first.classList.remove("selected");
        card.classList.add("selected");
        selected = [card];
        return;
      }

      // 🚫 If clicking STEP first or invalid flow → do nothing
      return;
    }
  });
});

function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}
function check() {
  let stepEl, answerEl;

// Detect which is step and which is answer
if (isStep(selected[0])) {
  stepEl = selected[0];
  answerEl = selected[1];
} else {
  stepEl = selected[1];
  answerEl = selected[0];
}

const a = stepEl;
const b = answerEl;

  if (a.dataset.match === b.dataset.match) {
  a.classList.add("correct");
  b.classList.add("correct");

  // copy background color from step → answer
  const stepColor = window.getComputedStyle(a).backgroundColor;
  b.style.background = stepColor;

  // add image to left card
  const img = b.querySelector("img").cloneNode(true);
  a.querySelector(".step-img").appendChild(img);

  speak("Correct");
  score++;

  drawLine(a, b);

  if (score === 5) {
    setTimeout(showFinal, 600);
  }
}
 else {

    a.classList.add("wrong");
    b.classList.add("wrong");
    speak("Wrong");
    setTimeout(() => {
      a.classList.remove("wrong", "selected");
      b.classList.remove("wrong", "selected");
    }, 500);
  }

  a.classList.remove("selected");
  b.classList.remove("selected");
  selected = [];
}
function drawLine(el1, el2) {

  // 📱 STOP DRAWING LINE IN MOBILE
  if (window.innerWidth <= 600) return;

  const svg = document.getElementById("lines");
  const gap = document.querySelector(".gap");

  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  const g = gap.getBoundingClientRect();

  const leftRect = r1.left < r2.left ? r1 : r2;
  const rightRect = r1.left < r2.left ? r2 : r1;

  const x1 = leftRect.right - g.left;
  const y1 = leftRect.top + leftRect.height / 2 - g.top;

  const x2 = rightRect.left - g.left;
  const y2 = rightRect.top + rightRect.height / 2 - g.top;

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);

  line.setAttribute("stroke", "#166534");
  line.setAttribute("stroke-width", "3");
  line.setAttribute("stroke-dasharray", "6 6");

  svg.appendChild(line);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/5`;
  const starBox = document.getElementById("finalstars");
starBox.innerHTML = "";

for (let i = 0; i < score; i++) {
  const star = document.createElement("div");
  star.className = "star";
  star.textContent = "⭐";
  starBox.appendChild(star);
}


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
