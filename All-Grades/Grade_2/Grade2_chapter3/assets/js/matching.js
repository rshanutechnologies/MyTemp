let dragged = null;
let selected = null;
let score = 0;

/* ✅ elements */
const popup = document.getElementById("feedbackPopup");
const circle = document.getElementById("feedbackCircle");
const progressWrap = document.getElementById("progressWrap");
const flyTick = document.getElementById("flyTick");

function speak(t) {
  speechSynthesis.cancel();
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

/* click LEFT puzzles */
document.querySelectorAll(".puzzle").forEach((p, idx) => {
  p.addEventListener("click", () => {
    // BLOCK: if puzzle is already disabled (matched), cannot select
    if (p.classList.contains("disabled")) return;

    // remove previous selection from all puzzles
    document.querySelectorAll(".puzzle").forEach(el =>
      el.classList.remove("selected")
    );

    selected = p;
    selected.dataset.index = idx;
    p.classList.add("selected");
  });
});

/* click RIGHT slots */
document.querySelectorAll(".slot").forEach((slot) => {
  slot.addEventListener("click", () => {
    // BLOCK: if no puzzle selected
    if (!selected) return;

    // BLOCK: if slot is already matched (has class matched or contains image already)
    if (slot.classList.contains("matched")) return;

    const dragIndex = Number(selected.dataset.index || 0);

    if (selected.dataset.key === slot.dataset.key) {
      // ✅ correct match
      showFeedback("correct");
      speak("Correct");

      flyTickToCircle(dragIndex, slot);

      setTimeout(() => {
        const c = progressWrap.children[dragIndex];
        if (c) {
          c.classList.add("active");
          c.textContent = "✔";
        }

        // Fill slot with the matched image
        slot.innerHTML = `
          <img src="${selected.dataset.img}">
          <div class="label">${slot.dataset.key}</div>
        `;
        
        // BLOCK: mark slot as matched to prevent re-matching
        slot.classList.add("matched");

        // BLOCK: mark puzzle as disabled (cannot be selected again)
        selected.classList.add("disabled");
        selected.classList.remove("selected");

        // Clear selection
        selected = null;

        score++;

        if (score === document.querySelectorAll(".puzzle").length) {
          setTimeout(showFinalPopup, 900);
        }

      }, 900);

    } else {
      // ❌ wrong match
      showFeedback("wrong");
      speak("Try again");
      
      // Optional: add error animation to slot
      slot.classList.add("error");
      setTimeout(() => {
        slot.classList.remove("error");
      }, 500);
      
      // Optional: add error animation to selected puzzle
      selected.classList.add("error");
      setTimeout(() => {
        selected.classList.remove("error");
      }, 500);
    }
  });
});

/* ✅ final popup */
function showFinalPopup() {
  document.getElementById("finalScoreText").textContent =
    `Score: ${score} / ${document.querySelectorAll(".puzzle").length}`;
  document.getElementById("finalStars").textContent = "⭐".repeat(score);

  document.getElementById("finalPopup").style.display = "flex";
  // speak("Congratulations");
}

/* ✅ restart game - reset everything */
function restartGame() {
  score = 0;
  selected = null;

  // reset puzzles
  document.querySelectorAll(".puzzle").forEach((p) => {
    p.classList.remove("disabled");
    p.classList.remove("selected");
    p.classList.remove("error");
  });

  // reset slots
  document.querySelectorAll(".slot").forEach((slot) => {
    slot.innerHTML = `<div class="lock">🔒</div><div class="label">${slot.dataset.key}</div>`;
    slot.classList.remove("matched");
    slot.classList.remove("error");
  });

  // reset progress circles
  initProgress();

  // hide final popup
  document.getElementById("finalPopup").style.display = "none";
  
  // reset any game over state
  // speak("Game restarted. Good luck!");
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

/* ======================================== */
/* KEY FIXES IMPLEMENTED:
 * 
 * 1. LEFT PUZZLE BLOCK:
 *    - Click handler checks `if (p.classList.contains("disabled")) return;`
 *    - After correct match, `selected.classList.add("disabled")` prevents re-selection
 * 
 * 2. RIGHT SLOT BLOCK:
 *    - Click handler checks `if (slot.classList.contains("matched")) return;`
 *    - After correct match, `slot.classList.add("matched")` prevents re-matching
 * 
 * 3. ERROR ANIMATION:
 *    - Added temporary "error" class for visual feedback on wrong matches
 * 
 * 4. RESTART FUNCTION:
 *    - Completely resets all classes: disabled, selected, matched, error
 *    - Re-initializes progress circles
 *    - Resets score and selection state
 * 
 * 5. All original features preserved:
 *    - Speech feedback
 *    - Fly tick animation
 *    - Progress circles with checkmarks
 *    - Popup notifications
 *    - Final score popup with stars
 * ======================================== */