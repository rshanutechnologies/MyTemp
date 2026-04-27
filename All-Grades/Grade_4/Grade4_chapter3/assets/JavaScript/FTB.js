const questions = [
  {
    q: "Aerial animals spend most of their time in the _______.",
    a: "air",
    img: "../assets/images/bird-img.png",
  },
  {
    q: "The webbed feet of frogs and newts help them to _______.",
    a: "swim",
    img: "../assets/images/frog-img.png",
  },
  {
    q: "Whales, dolphins and turtles move with the help of their _______.",
    a: "flippers",
    img: "../assets/images/dolphin-img.png",
  },
  {
    q: "Carnivores have _______ claws and teeth to tear and eat the flesh.",
    a: "sharp",
    img: "../assets/images/tiger-img.png",
  },
  {
    q: "A polar bear’s small ears help to reduce loss of _______ from its body.",
    a: "heat",
    img: "../assets/images/bear-img.png",
  },
];

let index = 0,
  score = 0;
const answers = Array(5).fill(null);

const qImg = document.getElementById("qImg");
const qText = document.getElementById("qText");
const input = document.getElementById("answerInput");
const check = document.getElementById("checkBtn");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
const inputBox = document.getElementById("inputBox");
const progress = document.getElementById("progress");
// const count = document.getElementById("countText");

function stars() {
  progress.innerHTML = "";

  questions.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "item";

    if (answers[i]) {
      d.classList.add("active");
      d.textContent = "⭐";
    } else {
      d.classList.add("lock");
      d.textContent = "🔒";
    }

    progress.appendChild(d);
  });
}

function load() {
  const q = questions[index];
  qImg.src = q.img;
  document.getElementById("qIndex").textContent = `Q${index + 1}.`;
  qText.textContent = q.q;
  input.value = answers[index] || "";
  input.disabled = !!answers[index];
  check.disabled = !!answers[index] || !input.value.trim();
  inputBox.classList.toggle("correct", !!answers[index]);
  prev.disabled = index === 0;
  next.disabled = !answers[index];
  // count.textContent = `${index + 1} / ${questions.length}`;
  stars();
}

input.oninput = () => {
  if (!answers[index]) check.disabled = !input.value.trim();
};

input.addEventListener("dragover", (e) => e.preventDefault());
input.addEventListener("drop", (e) => e.preventDefault());

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.volume = 0.1; // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

check.onclick = () => {
  if (input.value.trim().toLowerCase() === questions[index].a) {
    answers[index] = questions[index].a;
    score++;
    speak("Correct");
    showPopup(true);
    load();
    if (index === 4) setTimeout(showFinal, 1600);
  } else {
    speak("Wrong");
    showPopup(false);
    input.value = "";
    check.disabled = true;
  }
};

prev.onclick = () => {
  index--;
  load();
};
next.onclick = () => {
  index++;
  load();
};

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

load();
