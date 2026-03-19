const leftData = [
  {
    id: "1",
    text: "Rice and wheat",
    match: "c",
    img: "../assets/images/rw.png",
  },
  {
    id: "2",
    text: "Black gram and green gram",
    match: "e",
    img: "../assets/images/mt2.png",
  },
  {
    id: "3",
    text: "Vegetarian food",
    match: "a",
    img: "../assets/images/vegies.png",
  },
  {
    id: "4",
    text: "Eggs",
    match: "b",
    img: "../assets/images/Eggak.png",
  },
  {
    id: "5",
    text: "Non-vegetarian food",
    match: "d",
    img: "../assets/images/Meat.png",
  },
];

const rightData = [
  { match: "a", icon: "❖", text: "Vegetables" },
  { match: "b", icon: "❖", text: "Ducks" },
  { match: "c", icon: "❖", text: "Cereals" },
  { match: "d", icon: "❖", text: "Meat" },
  { match: "e", icon: "❖", text: "Pulses" },
];

let selectedLeft = null;
let matchesFound = 0;
let score = 0;
let connections = [];
let matchNumber = 1;

const leftCol = document.getElementById("leftColumn");
const rightCol = document.getElementById("rightColumn");
const svg = document.getElementById("line-canvas");

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

function init() {
  leftCol.innerHTML = "";
  rightCol.innerHTML = "";

  leftData.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.dataset.match = item.match;

    div.innerHTML = `
        <div class="icon-circle">
            <img src="${item.img}" class="left-icon">
        </div>

        <span class="question-text">${item.text}</span>
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
      <div class="letter">${item.icon}</div>
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

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 },
  });
}

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 },
  });
}

function handleMatch(leftEl, rightEl) {
  score++;

  leftEl.classList.add("matched");
  rightEl.classList.add("matched");
  leftEl.classList.remove("active");

  speak("Correct");
  fireConfetti();

  if (window.innerWidth < 800) {
    leftEl.dataset.num = matchNumber;
    rightEl.dataset.num = matchNumber;
    matchNumber++;
  }
  else {
    drawCurve(leftEl, rightEl);
    connections.push({ from: leftEl, to: rightEl });
  }

  selectedLeft = null;
  matchesFound++;

  if (matchesFound === leftData.length) {
    setTimeout(showFinal, 900);
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
  svg.style.zIndex = "0";
  leftCol.style.zIndex = "0";
  rightCol.style.zIndex = "0";
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${leftData.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);

  popup.style.display = "flex";
  fireConfettif();
}

window.addEventListener("resize", () => {
  svg.innerHTML = "";
  connections.forEach((c) => drawCurve(c.from, c.to));
});

init();
