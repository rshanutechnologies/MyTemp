let activeLabel = null;
let score = 0;
let answeredCount = 0;
const megnat = document.querySelector(".magnet");


document.querySelectorAll(".label").forEach((label) => {
  label.onclick = () => {
    document
      .querySelectorAll(".label")
      .forEach((l) => l.classList.remove("active"));
    label.classList.add("active");
    activeLabel = label;
   
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

document.querySelectorAll(".animal").forEach((animal) => {
  animal.onclick = () => {
  if (!activeLabel) return;

  if (activeLabel.dataset.value === animal.dataset.answer) {

    const matchedLabel = activeLabel;

    activeLabel.classList.add("used");
    activeLabel = null;

    placeAnimalAboveLabel(animal, matchedLabel);

    speak("Correct");
    

    score++;
answeredCount++;

if (answeredCount === 5) {
  setTimeout(showFinal, 800);
}
} else {
    animal.classList.add("shake");
    speak("Wrong");
   

    setTimeout(() => animal.classList.remove("shake"), 300);
  }
};

});
function placeAnimalAboveLabel(animal, label) {

  if (window.innerWidth <= 700) {

    animal.classList.add("matched-mobile");

    // Create wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "match-wrapper";

    // Insert wrapper before label
    label.parentNode.insertBefore(wrapper, label);

    // Put animal inside wrapper
    wrapper.appendChild(animal);

  } else {

    // Desktop behavior (your existing code)
    const labelsRect = document.querySelector(".labels").getBoundingClientRect();
    const labelRect = label.getBoundingClientRect();
    const fieldRect = document.querySelector(".field").getBoundingClientRect();

    const x = labelRect.left - fieldRect.left + (labelRect.width / 2) - 48;
    const y = labelsRect.top - fieldRect.top - animal.offsetHeight - 10;

    animal.style.left = x + "px";
    animal.style.top = y + "px";
    animal.style.zIndex = "20";
  }
}

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
    msg.textContent = "Great match!";
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
  megnat.style.display = "none";

  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/5`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

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

    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
