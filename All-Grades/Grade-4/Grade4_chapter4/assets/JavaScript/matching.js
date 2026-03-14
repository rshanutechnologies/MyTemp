let selected = null;
let correct = 0;
let matchCount = 1;

const leftCards = document.querySelectorAll("#left .card");
const rightCards = document.querySelectorAll("#right .card");
const svg = document.getElementById("lines");
const popup = document.getElementById("popup");
const popupBox = document.getElementById("popupBox");

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function drawCurve(el1, el2) {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  const parent = document.getElementById("matchGrid").getBoundingClientRect();

  const x1 = r1.right - parent.left;
  const y1 = r1.top + r1.height / 2 - parent.top;
  const x2 = r2.left - parent.left;
  const y2 = r2.top + r2.height / 2 - parent.top;

  const curveOffset = Math.abs(x2 - x1) * 0.4;

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    `M ${x1} ${y1} C ${x1 + curveOffset} ${y1},
         ${x2 - curveOffset} ${y2},
         ${x2} ${y2}`,
  );
  path.classList.add("match-line");
  svg.appendChild(path);
}

leftCards.forEach((card) => {
  card.onclick = () => {
    if (card.classList.contains("matched")) return;
    leftCards.forEach((c) => c.classList.remove("active"));
    selected = card;
    card.classList.add("active");
  };
});

rightCards.forEach((card) => {
  card.onclick = () => {
    if (!selected || card.classList.contains("matched")) return;

    if (selected.dataset.match === card.dataset.value) {
      speak("Correct!");
      selected.classList.add("matched");
      card.classList.add("matched");
      // drawCurve(selected, card);
      if (window.innerWidth > 900) {
        drawCurve(selected, card);
      } else {
        selected.dataset.num = matchCount;
        card.dataset.num = matchCount;
        matchCount++;
      }
      selected.classList.remove("active");
      selected = null;
      correct++;

      if (correct === leftCards.length) {
        setTimeout(showFinal, 700);
      }
    } else {
      speak("Wrong!");
      selected.classList.add("wrong");
      card.classList.add("wrong");
      setTimeout(() => {
        selected.classList.remove("wrong");
        card.classList.remove("wrong");
      }, 500);
    }
  };
});

function showFinal() {
  popup.style.display = "flex";
  popupBox.innerHTML = `
        <div class="popup-final-content">
          🎉 Congratulations!
          <span class="emoji">🏆</span>
          You finished the quiz!
          <div class="final-score">
            Score: <b>${correct} / ${leftCards.length}</b>
          </div>
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <div class="final-actions">
            <button class="restart" onclick="location.reload()">🔄 Restart</button>
          </div>
        </div>
      `;
}
