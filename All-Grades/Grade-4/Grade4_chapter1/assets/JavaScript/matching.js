let activeAnimal = null;
let score = 0;
const totalMatches = document.querySelectorAll(".animal").length;
const rows = document.querySelectorAll(".match-row");

/* select animal */
document.querySelectorAll(".animal").forEach((animal, index) => {
  animal.onclick = () => {
    if (animal.classList.contains("matched")) return;

    document
      .querySelectorAll(".animal")
      .forEach((a) => a.classList.remove("active"));
    animal.classList.add("active");
    activeAnimal = { el: animal, index };
  };
});

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

/* select food */
document.querySelectorAll(".action").forEach((action) => {
  action.onclick = () => {
    if (!activeAnimal || action.classList.contains("matched")) return;

    if (action.dataset.value === activeAnimal.el.dataset.answer) {
      speak("Correct");

      action.classList.add("matched");
      activeAnimal.el.classList.add("matched");
      activeAnimal.el.classList.remove("active");

      rows[activeAnimal.index].classList.add("filled");
      rows[activeAnimal.index].children[2].textContent = action.dataset.text;

      originalCorrectMatch(
        activeAnimal.el,
        action,
        activeAnimal.index,
        action.dataset.text,
      );

      score++;
      activeAnimal = null;

      if (score === totalMatches) {
        setTimeout(showFinal, 700);
      }
    } else {
      speak("Wrong");
      action.classList.add("wrong");
      setTimeout(() => action.classList.remove("wrong"), 300);
    }
  };
});

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/5`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

  // 🎉 CONFETTI EFFECT
  if (window.innerWidth >= 769) {
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
}

/* ================================
   MOBILE / SMALL LAPTOP MATCH NUMBERS
   ================================ */

let mobileMatchCount = 1;

function isSmallScreen() {
  return window.matchMedia("(max-width: 900px)").matches;
}

/* Hook into correct match */
const originalCorrectMatch = (animal, action, index, text) => {
  if (!isSmallScreen()) return;

  animal.dataset.match = mobileMatchCount;
  action.dataset.match = mobileMatchCount;

  animal.classList.add("show-number");
  action.classList.add("show-number");

  mobileMatchCount++;
};

/* MODIFY ONLY THIS PART INSIDE YOUR EXISTING CORRECT BLOCK */
/*
Inside:
if (action.dataset.value === activeAnimal.el.dataset.answer) { ... }

ADD this line just before score++ :
*/
