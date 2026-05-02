let selectedToken = null;
let matches = 0;
let score = 0;
const total = 5;

document.querySelectorAll(".tokens .token").forEach((token, index) => {
  token.dataset.index = index + 1; // 1,2,3,4...
});

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

document.querySelectorAll(".tokens .token").forEach((token) => {
  token.addEventListener("click", () => {

    if (token.classList.contains("disabled")) return;

    // remove old selection
    document.querySelectorAll(".token").forEach(t => t.classList.remove("active"));

    selectedToken = token;
    token.classList.add("active");

  });
});
document.querySelectorAll(".slot").forEach((slot) => {
  slot.addEventListener("click", () => {

    if (!selectedToken) return;
    if (slot.classList.contains("filled")) return;

    if (selectedToken.dataset.match === slot.dataset.match) {

      // progress
      matches++;
      document.getElementById("progressBar").style.width =
        (matches / total) * 100 + "%";

      // ✅ NUMBER FROM LEFT ORDER (IMPORTANT)
      const number = selectedToken.dataset.index;

      // style
      selectedToken.classList.add("matched");
      slot.classList.add("matched");

      // remove old badge if any (safety)
      selectedToken.querySelector(".match-badge")?.remove();
      slot.querySelector(".match-badge")?.remove();

      // LEFT badge
      const leftBadge = document.createElement("div");
      leftBadge.className = "match-badge";
      leftBadge.textContent = number;
      selectedToken.appendChild(leftBadge);

      // RIGHT badge
      const rightBadge = document.createElement("div");
      rightBadge.className = "match-badge";
      rightBadge.textContent = number;
      slot.appendChild(rightBadge);

      // disable + finalize
      selectedToken.classList.add("disabled");
      selectedToken.classList.remove("active");
      slot.classList.add("filled");

      speak("Correct!");
      score++;

      selectedToken = null;

      if (matches === total) setTimeout(showFinal, 800);

    } else {
      speak("Wrong");
    }

  });
});