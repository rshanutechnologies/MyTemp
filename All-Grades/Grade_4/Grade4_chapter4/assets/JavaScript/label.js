const inputs = document.querySelectorAll("input");
const checkBtn = document.getElementById("checkBtn");
const popup = document.getElementById("popup");        // ← ADD THIS
const popupText = document.getElementById("popupText"); // ← ADD THIS

let activeInput = null;
let correct = 0;
let score = 0;

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

/* ENABLE CHECK BUTTON + LOCK OTHER INPUTS */
inputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      activeInput = input;
      checkBtn.disabled = false;

      inputs.forEach((i) => {
        if (i !== input) i.disabled = true;
      });
    } else {
      resetInputs();
    }
  });
});

inputs.forEach((input) => {
  input.addEventListener("dragover", (e) => e.preventDefault());
  input.addEventListener("drop", (e) => e.preventDefault());
  input.addEventListener("paste", (e) => e.preventDefault());
  input.addEventListener("copy", (e) => e.preventDefault());
  input.addEventListener("cut", (e) => e.preventDefault());
  input.addEventListener("contextmenu", (e) => e.preventDefault());
});

// function speak(t) {
//   speechSynthesis.cancel();
//   const msg = new SpeechSynthesisUtterance(t);
//   msg.volume = 0.1; // 🔉 lower volume (0 to 1)
//   msg.rate = 1;
//   msg.pitch = 1;

//   speechSynthesis.speak(msg);
// }

/* CHECK BUTTON CLICK */
checkBtn.addEventListener("click", () => {
  if (!activeInput) return;

  const ans = activeInput.dataset.answer.toLowerCase();
  const line = document.querySelector("." + activeInput.dataset.line);
  const userAnswer = activeInput.value.trim().toLowerCase();

  if (userAnswer === ans) {
    // ✅ CORRECT
    activeInput.classList.add("correct");
    activeInput.disabled = true;
    line.classList.add("correct");

    correct++;
    score++;
    speak("Correct");
    showPopup(`
        <div class="popup-correct">
          <span class="check">✅ Correct</span>
          <span class="happy">😊</span>
          <div class="stars">⭐</div>
        </div>
      `);

    activeInput = null;
    checkBtn.disabled = true;

    inputs.forEach((i) => {
      if (!i.classList.contains("correct")) i.disabled = false;
    });

    if (correct === inputs.length) {
      setTimeout(() => {
        showPopup(
          `
            <div class="popup-final-content">
              🎉 Congratulations!
              <span class="emoji">🏆</span>
              You finished the quiz!
              <div class="final-score">
                  Score: <b>${inputs.length}/${inputs.length}</b>
              </div>
              <div class="stars">⭐⭐⭐⭐⭐</div>
              <div class="final-actions">
                <button class="restart" onclick="location.reload()">🔄 Restart</button>
              </div>
            </div>
          `,
          true,
        );
      }, 1200);
    }
  } else {
    // ❌ WRONG
    speak("Wrong");
    showPopup(`
        <div class="popup-wrong">
          <span class="cross">❌ Wrong</span>
          <span class="sad">😢</span>
          <div class="tip">💡 You can do it!</div>
        </div>
      `);

    activeInput.classList.add("wrong");

    setTimeout(() => {
      activeInput.classList.remove("wrong");
      activeInput.value = "";
      resetInputs();
    }, 400);
  }
});

/* RESET STATE */
function resetInputs() {
  activeInput = null;
  checkBtn.disabled = true;

  inputs.forEach((i) => {
    if (!i.classList.contains("correct")) {
      i.disabled = false;
    }
  });
}

function showPopup(html, final = false) {
  popup.style.display = "flex";
  popupText.className = final ? "popup-box popup-final" : "popup-box";
  popupText.innerHTML = html;
  if (!final) setTimeout(() => (popup.style.display = "none"), 1000);
}
