const leftData = [
  {
    id: "1",
    text: " Heart",
    match: "e",
    img: "../assets/images/heart.png",
  },
  {
    id: "2",
    text: " Lungs",
    match: "c",
    img: "../assets/images/lungs.png",
  },
  {
    id: "3",
    text: " Veins",
    match: "d",
    img: "../assets/images/veins.png",
  },
  {
    id: "4",
    text: " Nose",
    match: "a",
    img: "../assets/images/nose.png",
  },
  {
    id: "5",
    text: " Arteries",
    match: "b",
    img: "../assets/images/arteries.png",
  },
];

const rightData = [
  { match: "a", text: "The exchange of gases takes place here." },
  { match: "b", text: "They carry oxygen rich blood to all the body parts." },
  { match: "c", text: "It helps in taking in oxygen rich air and expelling carbon dioxide rich air out of the body." },
  { match: "d", text: "They carry carbon dioxide rich blood back to the heart." },
  { match: "e", text: "It pumps the blood." },
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
                    <div class="answer-box"></div>
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
  confetti({
    particleCount: 35,
    spread: 70,
    origin: { y: 0.7 },
    scalar: 0.8
  });
}
function handleMatch(leftEl, rightEl) {
  score++;

  leftEl.classList.add("matched");
  rightEl.classList.add("matched");
  leftEl.classList.remove("active");

  const img = leftEl.querySelector("img").cloneNode(true);
  const box = rightEl.querySelector(".answer-box");
  box.appendChild(img);

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
  smallConfetti();
}

window.addEventListener("resize", () => {
  svg.innerHTML = "";
  connections.forEach((c) => drawCurve(c.from, c.to));
});

init();
