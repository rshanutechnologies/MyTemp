let dragged = null;
let score = 0;

/* ✅ elements */
const popup = document.getElementById("feedbackPopup");
const circle = document.getElementById("feedbackCircle");
const progressWrap = document.getElementById("progressWrap");
const flyTick = document.getElementById("flyTick");

// /* ✅ text to speech */
// function speak(text) {
//   window.speechSynthesis.cancel();
//   const u = new SpeechSynthesisUtterance(text);
//   u.lang = "en-Uk";
//   u.rate = 0.9;
//   window.speechSynthesis.speak(u);
// }

function speak(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

/* ✅ init progress circles */
function initProgress() {
  progressWrap.innerHTML = "";
  const puzzles = document.querySelectorAll(".puzzle");
  puzzles.forEach((_, i) => {
    const c = document.createElement("div");
    c.className = "circle";
    c.textContent = i + 1;
    progressWrap.appendChild(c);
  });
}
initProgress();

/* ✅ popup */
function showFeedback(type) {
  popup.style.display = "flex";
  circle.className = "feedback-circle " + type;
  circle.innerHTML = type === "correct" ? "✔" : "✖";
  setTimeout(() => (popup.style.display = "none"), 850);
}

/* ✅ tick fly to circle */
function flyTickToCircle(i, fromEl) {
  const target = progressWrap.children[i];
  if (!target) return;

  const startRect = fromEl.getBoundingClientRect();
  const endRect = target.getBoundingClientRect();

  flyTick.style.opacity = "1";
  flyTick.style.left = startRect.left + startRect.width / 2 + "px";
  flyTick.style.top = startRect.top + startRect.height / 2 + "px";

  void flyTick.offsetHeight;

  flyTick.style.transition = "all .8s ease";
  flyTick.style.left = endRect.left + endRect.width / 2 + "px";
  flyTick.style.top = endRect.top + endRect.height / 2 + "px";
  flyTick.style.transform = "translate(-50%,-50%) scale(.35)";

  setTimeout(() => {
    flyTick.style.opacity = "0";
    flyTick.style.transition = "none";
    flyTick.style.transform = "translate(-50%,-50%) scale(1)";
  }, 850);
}

/* ✅ drag start */
document.querySelectorAll(".puzzle").forEach((p, idx) => {
  p.ondragstart = () => {
    dragged = p;
    dragged.dataset.index = idx; // progress index
  };
});

/* ✅ drop */
document.querySelectorAll(".slot").forEach((slot) => {
  slot.ondragover = (e) => e.preventDefault();
  slot.ondrop = () => {
    if (!dragged) return;

    const dragIndex = Number(dragged.dataset.index || 0);

    if (dragged.dataset.key === slot.dataset.key) {
      // ✅ Correct
      showFeedback("correct");
      speak("Correct");

      // ✅ fly tick to progress circle from slot position
      flyTickToCircle(dragIndex, slot);

      setTimeout(() => {
        // mark circle active
        const c = progressWrap.children[dragIndex];
        if (c) {
          c.classList.add("active");
          c.textContent = "✔";
        }

        // unlock slot and disable puzzle
        slot.innerHTML = `<img src="${dragged.dataset.img}"><div class="label">${slot.dataset.key}</div>`;
        dragged.classList.add("disabled");

        score++;
        if (score === document.querySelectorAll(".puzzle").length) {
          setTimeout(showFinalPopup, 900);
        }
      }, 900);
    } else {
      // ❌ Wrong
      showFeedback("wrong");
      speak("Try again");
    }
  };
});

/* ✅ final popup */
function showFinalPopup() {
  document.getElementById("finalScoreText").textContent =
    `Score: ${score} / ${document.querySelectorAll(".puzzle").length}`;
  document.getElementById("finalStars").textContent = "⭐".repeat(score);

  document.getElementById("finalPopup").style.display = "flex";
  speak("Congratulations");
}

/* ✅ restart */
function restartGame() {
  score = 0;

  // reset puzzles
  document.querySelectorAll(".puzzle").forEach((p) => {
    p.classList.remove("disabled");
  });

  // reset slots
  document.querySelectorAll(".slot").forEach((slot) => {
    slot.innerHTML = `<div class="lock">🔒</div><div class="label">${slot.dataset.key}</div>`;
  });

  // reset circles
  initProgress();

  document.getElementById("finalPopup").style.display = "none";
}

/* 🔹 HINT POPUP CONTROLS */
function openHintPopup() {
  document.getElementById("hintPopup").style.display = "flex";
}

function closeHintPopup(e) {
  // close only if clicking outside the popup box
  if (e.target.id === "hintPopup") {
    document.getElementById("hintPopup").style.display = "none";
  }
}
