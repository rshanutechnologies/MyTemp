const leftData = [
  {
    id: "1",
    text: "1. Pliers",
    match: "c",
    img: "../assets/images/Pliers.png",
  },
  {
    id: "2",
    text: "2. Doorknob",
    match: "a",
    img: "../assets/images/Doorknob.png",
  },
  {
    id: "3",
    text: "3. Wheelchair ramp",
    match: "e",
    img: "../assets/images/Wheelchairramp.png",
  },
  {
    id: "4",
    text: "4. Knife",
    match: "b",
    img: "../assets/images/knifeak.png",
  },
  {
    id: "5",
    text: "5. Corkscrew",
    match: "d",
    img: "../assets/images/Corkscrew.png",
  },
];

const rightData = [
  { match: "a", text: "Wheel and axle" },
  { match: "b", text: "Wedge" },
  { match: "c", text: "Lever" },
  { match: "d", text: "Screw" },
  { match: "e", text: "Inclined plane" },
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

    div.innerHTML = `
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
  const duration = 500;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

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


function getScale(element) {
  const rect = element.getBoundingClientRect();
  return rect.width / element.offsetWidth;
}

function drawCurve(el1, el2) {
  const main = document.querySelector(".main");
  const scale = getScale(main); // 👈 auto detect scale

  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();
  const containerRect = svg.getBoundingClientRect();

  const x1 = (rect1.right - containerRect.left) / scale;
  const y1 = (rect1.top + rect1.height / 2 - containerRect.top) / scale;

  const x2 = (rect2.left - containerRect.left) / scale;
  const y2 = (rect2.top + rect2.height / 2 - containerRect.top) / scale;

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

function showFinal() {
  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${leftData.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);

  document.getElementById("finalPopup").style.display = "flex";
  bigConfetti();
}

window.addEventListener("resize", () => {
  svg.innerHTML = "";
  connections.forEach((c) => drawCurve(c.from, c.to));
});

init();
