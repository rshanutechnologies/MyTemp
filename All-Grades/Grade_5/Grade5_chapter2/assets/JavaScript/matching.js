let draggedToken = null;
let matches = 0;
let score = 0;
const total = 5;

// function speak(text) {
//   const msg = new SpeechSynthesisUtterance(text);
//   window.speechSynthesis.cancel();
//   window.speechSynthesis.speak(msg);
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

document.querySelectorAll(".tokens .token").forEach((token) => {
  token.addEventListener("dragstart", (e) => {
    // Prevent dragging if already disabled
    if (token.classList.contains("disabled")) {
      e.preventDefault();
      return;
    }
    draggedToken = token;
    token.style.opacity = "0.5";
  });
  token.addEventListener("dragend", () => {
    if (draggedToken) draggedToken.style.opacity = "1";
  });
});

document.querySelectorAll(".slot").forEach((slot) => {
  slot.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!slot.classList.contains("filled")) slot.classList.add("drag-over");
  });

  slot.addEventListener("dragleave", () => slot.classList.remove("drag-over"));

  slot.addEventListener("drop", (e) => {
    slot.classList.remove("drag-over");
    if (slot.classList.contains("filled") || !draggedToken) return;

    if (draggedToken.dataset.match === slot.dataset.match) {
      matches++;
      document.getElementById("progressBar").style.width =
        (matches / total) * 100 + "%";

      slot.classList.add("filled");
      slot.querySelector(".drop-zone").remove();

      // 1. CLONE the token to put a copy in the slot
const emoji = draggedToken.querySelector("span").cloneNode(true);
emoji.style.fontSize = "32px"; // optional
slot.appendChild(emoji);



      // 2. DISABLE the original left-side token
      draggedToken.classList.add("disabled");
      draggedToken.setAttribute("draggable", "false");

      speak("Correct!");
      score++;
      draggedToken = null;

      if (matches === total) setTimeout(showFinal, 800);
    } else {
      speak("Wrong");
    }
  });
});

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/5`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

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
