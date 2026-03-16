// const wheel = document.getElementById("wheel");
// const spinBtn = document.getElementById("spin");

// let angle = 0;
let activeTag = null;
let score = 0;

const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const totalCorrect = document.querySelectorAll(".tag").length;

const hintBtn = document.getElementById("hintBtn");
const hintPopup = document.getElementById("hintPopup");

hintBtn.onclick = () => {
  hintPopup.style.display =
    hintPopup.style.display === "block" ? "none" : "block";
};

// Close hint popup when clicking outside
document.addEventListener("click", (e) => {
  if (
    hintPopup.style.display === "block" &&
    !hintPopup.contains(e.target) &&
    e.target !== hintBtn
  ) {
    hintPopup.style.display = "none";
  }
});

/* 🔊 TEXT TO SPEECH */
function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

// spinBtn.onclick = () => {
//   angle += Math.floor(Math.random() * 360 + 720);
//   wheel.style.transform = `rotate(${angle}deg)`;
// };

document.querySelectorAll(".tag").forEach((tag) => {
  tag.onclick = () => {
    if (tag.classList.contains("used")) return;
    document
      .querySelectorAll(".tag")
      .forEach((t) => t.classList.remove("active"));
    tag.classList.add("active");
    activeTag = tag;
  };
});

document.querySelectorAll(".plant").forEach((plant) => {
  plant.onclick = () => {
    if (!activeTag) return;

    if (activeTag.dataset.value === plant.dataset.answer) {
      plant.classList.add("locked");

      const imgClone = plant.querySelector("img").cloneNode(true);
      imgClone.classList.add("matched-img");
      activeTag.prepend(imgClone);

      activeTag.classList.add("used");
      activeTag.classList.remove("active");
      activeTag = null;

      score++;
      // updateProgress();
      speak("Correct");
      showPopup(true);

      if (score === totalCorrect) {
        setTimeout(showFinal, 1600);
      }
    } else {
      plant.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(.85)" },
          { transform: "scale(1)" },
        ],
        { duration: 300 },
      );
      speak("Wrong");
      showPopup(false);
    }
  };
});

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
