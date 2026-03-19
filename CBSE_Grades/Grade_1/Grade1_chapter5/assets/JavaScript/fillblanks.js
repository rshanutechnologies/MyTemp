const questions = [
  {
    q: "Q.1 Food gives us __________ to work and play.",
    a: ["energy"],
    img: "../assets/images/WorkEnergy.png",
  },
  {
    q: "Q.2 We get milk from __________ and __________.",
    a: ["cows", "buffaloes"],
    img: "../assets/images/CowBuffelo.png",
  },
  {
    q: "Q.3 Non-vegetarians eat food from both plants and __________.",
    a: ["animals"],
    img: "../assets/images/PlantAnimal.png",
  },
  {
    q: "Q.4 We should eat fresh, clean and __________ food.",
    a: ["healthy"],
    img: "../assets/images/NutritiousFoodak.png",
  },
  {
    q: "Q.5 We should never __________ food.",
    a: ["waste"],
    img: "../assets/images/Dustbin.png",
  },
];

let index = 0;
let score = 0;

const answers = questions.map((q) => ({
  used: [],
  boxes: q.a.map(() => ({
    value: "",
    correct: false,
  })),
}));

const qImgEl = document.getElementById("qImg");
const qTextEl = document.getElementById("qText");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
const container = document.getElementById("inputsContainer");

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function preloadImages(callback) {
  const loader = document.getElementById("imgLoader");

  let loaded = 0;

  questions.forEach((q) => {
    const img = new Image();
    img.src = q.img;

    img.onload = img.onerror = () => {
      loaded++;

      if (loaded === questions.length) {
        loader.style.display = "none";
        callback();
      }
    };
  });
}

function loadQuestion() {
  const q = questions[index];
  const state = answers[index];

  qImgEl.src = q.img;
  qTextEl.textContent = q.q;

  container.innerHTML = "";

  q.a.forEach((_, i) => {
    const box = document.createElement("div");
    box.className = "input-box";

    const input = document.createElement("input");
    input.placeholder = "Type your answer...";

    const btn = document.createElement("button");
    btn.textContent = "Submit";
    btn.disabled = true;

    input.addEventListener("input", () => {
      btn.disabled = input.value.trim() === "";
    });

    if (state.boxes[i].correct) {
      box.classList.add("correct");
      input.value = state.boxes[i].value;
      input.disabled = true;
      btn.disabled = true;
    }

    btn.onclick = () => checkAnswer(input, btn, box, i);

    box.append(input, btn);
    container.appendChild(box);
  });

  prev.disabled = index === 0;

  const allDone = state.boxes.every((b) => b.correct);
  next.disabled = !allDone;
}

function checkAnswer(input, btn, box, i) {
  const value = input.value.trim().toLowerCase();
  const answersList = questions[index].a;
  const state = answers[index];

  if (answersList.includes(value) && !state.used.includes(value)) {
    box.classList.add("correct");

    input.disabled = true;
    btn.disabled = true;

    state.used.push(value);

    state.boxes[i] = {
      value: value,
      correct: true,
    };

    speak("Correct");
    showPopup(true);
    fireConfetti();
  } else {
    input.value = "";
    speak("Wrong");
    showPopup(false);
  }

  checkAllAnswered();
}

function checkAllAnswered() {
  const state = answers[index];
  const allDone = state.boxes.every((b) => b.correct);

  if (allDone) {
    next.disabled = false;

    if (!state.scored) {
      score++;
      state.scored = true;

      if (index === questions.length - 1) {
        setTimeout(showFinal, 1600);
      }
    }
  } else {
    next.disabled = true;
  }
}

prev.onclick = () => {
  if (index > 0) {
    index--;
    loadQuestion();
  }
};

next.onclick = () => {
  if (index < questions.length - 1) {
    index++;
    loadQuestion();
  }
};

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉😊";
    title.textContent = "Great Job!";
    msg.textContent = "You got it right!";
  } else {
    icon.textContent = "🥲💭";
    title.textContent = "Oops!";
    msg.textContent = "Try again, you can do it!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${questions.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);

  popup.style.display = "flex";

  fireConfettif();
}

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 },
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 },
  });
}

preloadImages(loadQuestion);
