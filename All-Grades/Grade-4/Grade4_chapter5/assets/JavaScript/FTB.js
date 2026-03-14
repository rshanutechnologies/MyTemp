const questions = [
  {
    q: "Q1. __________, __________ and __________ are the three types of soil.",
    a: ["sandy", "clayey", "loamy"],
    img: "../assets/images/soils-img.png",
    hint: "Think of different kinds of soil found on land",
  },
  {
    q: "Q2. Trees control __________ by using carbon dioxide for the process of photosynthesis.",
    a: ["global warming"],
    img: "../assets/images/trees-img.png",
    hint: "It is related to increase in Earth’s temperature",
  },
  {
    q: "Q3. Animals like __________ and __________ help in dispersal of seeds.",
    a: ["squirrel", "monkey"],
    img: "../assets/images/animals-img.png",
    hint: "Some animals carry or scatter seeds",
  },
  {
    q: "Q4. Many minerals are obtained from deep inside the __________.",
    a: ["earth"],
    img: "../assets/images/minerals-img.png",
    hint: "It is the planet we live on",
  },
  {
    q: "Q5. __________, __________ and __________ are some examples of fossil fuels.",
    a: ["coal", "crude oil", "natural gas"],
    img: "../assets/images/fossil-img.png",
    hint: "These fuels are formed from dead plants and animals",
  },
];

let index = 0,
  score = 0;
// const answers = Array(5).fill(null);

const qText = document.getElementById("qText");
const qImg = document.getElementById("qImg");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
const inputBox = document.getElementById("inputBox");
const hintBtn = document.querySelector(".hint-btn");
const hintPopup = document.getElementById("hintPopup");
const hintPopupText = document.getElementById("hintPopupText");

const userAnswers = questions.map((q) => ({
  used: [],
  boxes: q.a.map(() => ({
    value: "",
    correct: false,
  })),
}));

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

//HINT POPUP HANDLER
hintBtn.onclick = (e) => {
  const rect = e.target.getBoundingClientRect();

  hintPopupText.textContent = questions[index].hint;

  // hintPopup.style.left = rect.left - 40 + "px";
  // hintPopup.style.top = rect.top - 100 + "px";

  hintPopup.style.display =
    hintPopup.style.display === "block" ? "none" : "block";
};

// Close hint popup when clicking anywhere on screen
document.addEventListener("click", () => {
  hintPopup.style.display = "none";
});

// Prevent closing when clicking the hint popup itself
hintPopup.addEventListener("click", (e) => {
  e.stopPropagation();
});

// Prevent closing when clicking the hint button
hintBtn.addEventListener("click", (e) => {
  e.stopPropagation();
});

function load() {
  const q = questions[index];
  qText.textContent = q.q;
  qImg.src = q.img;
  prev.disabled = index === 0;

  inputsRow.innerHTML = "";

  q.a.forEach((_, i) => {
    const box = document.createElement("div");
    box.className = "input-box";

    const input = document.createElement("input");
    input.value = userAnswers[index].boxes[i].value;

    const btn = document.createElement("button");
    btn.textContent = "Check";
    btn.disabled = true;

    input.addEventListener("input", () => {
      btn.disabled = input.value.trim() === "";
    });

    if (userAnswers[index].boxes[i].correct) {
      box.classList.add("correct");
      input.disabled = true;
      btn.disabled = true;
    }

    btn.onclick = () => checkAnswer(input, btn, box, i);
    box.append(input, btn);
    inputsRow.appendChild(box);
  });

  checkAllAnswered();
}

function checkAnswer(input, btn, box, i) {
  const value = input.value.trim().toLowerCase();
  const answers = questions[index].a;
  const state = userAnswers[index];

  // check if value is a valid answer AND not already used
  if (answers.includes(value) && !state.used.includes(value)) {
    box.classList.add("correct");
    input.disabled = true;
    btn.disabled = true;

    state.used.push(value);
    state.boxes[i] = {
      value,
      correct: true,
    };

    speak("Correct");
    showPopup(true);
  } else {
    input.value = "";
    btn.disabled = true;
    speak("Wrong");
    showPopup(false);
  }

  checkAllAnswered();
}

function checkAllAnswered() {
  const allDone = userAnswers[index].boxes.every((b) => b.correct);

  next.disabled = !allDone;

  if (allDone && !userAnswers[index].scored) {
    score++;
    userAnswers[index].scored = true;
    if (index === questions.length - 1) {
      setTimeout(showFinal, 1600);
    }
  }
}

prev.onclick = () => {
  if (index > 0) {
    index--;
    load();
  }
};

next.onclick = () => {
  if (index < questions.length - 1) {
    index++;
    load();
  } else {
    showFinal();
  }
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
