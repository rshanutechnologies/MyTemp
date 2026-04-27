const questions = [
  {
    q: "Q.1 The process by which living things are able to produce more of their own kind is called ________.",
    a: "reproduction",
    img: "../assets/images/cats-img.png",
  },
  {
    q: "Q.2 Dolphins and blue whales are ________ that live in water.",
    a: "mammals",
    img: "../assets/images/dolphin-img.png",
  },
  {
    q: "Q.3 The process of birds sitting on their eggs to keep them warm is known as ________.",
    a: "incubation",
    img: "../assets/images/hen-img.png",
  },
  {
    q: "Q.4 The ________ provides nutrition to the growing embryo.",
    a: "yolk",
    img: "../assets/images/embryo-img.png",
  },
  {
    q: "Q.5 A pupa is covered by a protective layer called the ________.",
    a: "cocoon",
    img: "../assets/images/pupa -img.png",
  },
];

let index = 0,
  score = 0;
const answered = Array(questions.length).fill(false);

const qEl = document.getElementById("question");
const img = document.getElementById("image");
const input = document.getElementById("answer");
// 🚫 Block drag & drop inside input
input.addEventListener("dragover", (e) => e.preventDefault());
input.addEventListener("drop", (e) => e.preventDefault());

// 🚫 Block paste
input.addEventListener("paste", (e) => e.preventDefault());

// 🚫 Block SPACE key
input.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    e.preventDefault();
  }
});
const checkBtn = document.getElementById("checkBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBoxes = document.querySelectorAll(".progress .box");

function load() {
  const q = questions[index];
  qEl.textContent = q.q;
  img.src = q.img;

  if (answered[index]) {
    input.value = q.a;
    input.disabled = true;
    checkBtn.disabled = true;
    nextBtn.disabled = false;
  } else {
    input.value = "";
    input.disabled = false;
    checkBtn.disabled = true;
    nextBtn.disabled = true;
  }

  prevBtn.disabled = index === 0;

  progressBoxes.forEach((b, i) => {
    if (answered[i]) {
      b.classList.add("done");
      b.textContent = "✔";
    } else {
      b.classList.remove("done");
      b.textContent = "";
    }
  });
}

input.addEventListener("input", () => {
  // ❌ remove spaces automatically
  input.value = input.value.replace(/\s/g, "");

  checkBtn.disabled = !input.value.trim() || input.disabled;
});

// function speak(t) {
//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(t));
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

checkBtn.onclick = () => {
  if (input.value.trim().toLowerCase() === questions[index].a) {
    answered[index] = true;
    score++;
    input.disabled = true;
    checkBtn.disabled = true;
    nextBtn.disabled = false;
    speak("Correct");
    showPopup(true);
    if (index === questions.length - 1) setTimeout(showFinal, 1600);
  } else {
    input.value = "";
    speak("Wrong");
    showPopup(false);
  }
};

prevBtn.onclick = () => {
  index--;
  load();
};
nextBtn.onclick = () => {
  index++;
  load();
};

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
  prevBtn.style.zIndex = "0";
  nextBtn.style.zIndex = "0";
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
