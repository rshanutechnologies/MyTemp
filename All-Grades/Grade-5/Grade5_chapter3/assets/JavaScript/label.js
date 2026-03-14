const inputs = document.querySelectorAll("input");
const checkBtn = document.getElementById("checkBtn");

let activeInput = null;
let correct = 0;
let score = 0;

// function speak(text) {
//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(text));
// }

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

// function speak(text) {
//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(text));
// }

function speak(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";  
  msg.volume = 0.25;   // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

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
    showPopup(true);

    activeInput = null;
    checkBtn.disabled = true;

    inputs.forEach((i) => {
      if (!i.classList.contains("correct")) i.disabled = false;
    });

    if (correct === inputs.length) {
      setTimeout(showFinal, 1600);
    }
  } else {
    // ❌ WRONG
    speak("Wrong");
    showPopup(false);

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

/* POPUPS */
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";
  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }
  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/9`;
  document.getElementById("stars").textContent = "⭐".repeat(score - 4);

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
