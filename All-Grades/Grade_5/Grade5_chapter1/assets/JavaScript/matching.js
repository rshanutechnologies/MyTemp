let popupTimer = null;

const pairs = [
  {
    l: "Yellowish sac-like structure on filament",
    r: "Anther",
    img: "../assets/images/anther.png",
  },
  {
    l: "Fine powdery particles on the anther",
    r: "Pollen grains",
    img: "../assets/images/Pollengrains.png",
  },
  {
    l: "Female reproductive part of a flower   ",
    r: "Pistil",
    img: "../assets/images/MQ3.png",
  },
  {
    l: "Female reproductive unit",
    r: "Carpel",
    img: "../assets/images/carpelak.png",
  },
  {
    l: "The long tube-like extension of the ovary",
    r: "Style",
    img: "../assets/images/littleStyle.png",
  },
  {
    l: "The Swollen lower part of carpel",
    r: "Ovary",
    img: "../assets/images/ovaryak.png",
  },
];

const images = {
  Anther: "../assets/images/anther.png",
  "Pollen grains": "../assets/images/Pollengrains.png",
  Pistil: "../assets/images/MQ3.png",
  Carpel: "../assets/images/carpelak.png",
  Style: "../assets/images/littleStyle.png",
  Ovary: "../assets/images/ovaryak.png",
};

let armed = null;
let score = 0;
let matched = 0;

const leftCol = document.getElementById("leftCol");
const rightCol = document.getElementById("rightCol");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

const svg = document.getElementById("connectionLines");

// function drawConnection(leftEl, rightEl) {

//   const svgRect = svg.getBoundingClientRect();
//   const leftRect = leftEl.getBoundingClientRect();
//   const rightRect = rightEl.getBoundingClientRect();

//   const startX = leftRect.right - svgRect.left;
//   const startY = leftRect.top + leftRect.height / 2 - svgRect.top;

//   const endX = rightRect.left - svgRect.left;
//   const endY = rightRect.top + rightRect.height / 2 - svgRect.top;
//    const controlOffset = (endX - startX) * 0.25;
//   const curveOffset = 120; // controls curve depth

//   const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

//   const d = `
//     M ${startX} ${startY}
//     C ${startX + curveOffset} ${startY},
//       ${endX - curveOffset} ${endY},
//       ${endX} ${endY}
//   `;

//   path.setAttribute("d", d);
//   path.setAttribute("class", "connection-path");

//   svg.appendChild(path);
// }


// function speak(t){
//  speechSynthesis.cancel();
//  speechSynthesis.speak(new SpeechSynthesisUtterance(t));
// }

function speak(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25; // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}
function showPopup(html, final = false) {
  popup.style.display = "flex";
  popupText.className = final ? "popup-box popup-final" : "popup-box";
  popupText.innerHTML = html;

  if (popupTimer) clearTimeout(popupTimer);

  if (!final) {
    popupTimer = setTimeout(() => (popup.style.display = "none"), 1000);
  }
}

function render() {
  leftCol.innerHTML = "";
  rightCol.innerHTML = "";

  pairs.forEach((p) => {
    const l = document.createElement("div");
    l.className = "item";
    l.innerHTML = `
 
  <span class="question-text">${p.l}</span>
`;

    l.onclick = () => arm(l, p);
    leftCol.appendChild(l);
  });

  [...pairs]
    .sort(() => Math.random() - 0.5)
    .forEach((p) => {
      const r = document.createElement("div");
      r.className = "item";
      r.innerHTML = `<img src="${images[p.r]}"><span>${p.r}</span>`;
      r.onclick = () => attempt(r, p);
      rightCol.appendChild(r);
    });
}

function arm(el, p) {
  if (el.classList.contains("correct")) return;
  document
    .querySelectorAll(".left .item")
    .forEach((i) => i.classList.remove("armed"));
  el.classList.add("armed");
  armed = { el, p };
}

function attempt(el, p) {
  if (!armed || el.classList.contains("correct")) return;

 if (armed.p.r === p.r) {
  armed.el.classList.add("correct");
  el.classList.add("correct");

  // ✅ GET LEFT POSITION NUMBER
  const leftItems = document.querySelectorAll(".left .item");
  const number = Array.from(leftItems).indexOf(armed.el) + 1;

  // ✅ APPLY NUMBER TO BOTH SIDES
  armed.el.setAttribute("data-match", number);
  el.setAttribute("data-match", number);

  score++;
  matched++;
  speak("Correct");

  document
    .querySelectorAll(".left .item")
    .forEach((i) => i.classList.remove("armed"));

  armed = null;

  if (matched === pairs.length) {
    setTimeout(finalPopup, 1100);
  }
}
  else {
    speak("Wrong");

    // ⬅️ LEFT QUESTION STAYS SELECTED (NO RESET)
  }
}

function finalPopup() {
  showPopup(
    `
  <div class="popup-final-content">
   <div>🎉 Congratulations!</div>
   <div class="emoji">🏆</div>
      <div>You finished the quiz!</div>
   <div>Score:6/6</b></div>
   <div class="stars">⭐⭐⭐⭐⭐</div>

   <div class="final-actions">
    <button class="restart" onclick="location.reload()">🔄 Restart</button>
    
   </div>
  </div>
 `,
    true,
  );
}

render();
