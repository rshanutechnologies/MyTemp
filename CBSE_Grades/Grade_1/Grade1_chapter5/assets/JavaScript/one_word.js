const quizData = [
  {
    q: "Q.1 We need this every day to stay strong and healthy",
    a: "FOOD",
    img: "../assets/images/Boyeatt.png",
  },
  {
    q: "Q.2 It is the first meal of the day",
    a: "BREAKFAST",
    img: "../assets/images/Breakfastak.png",
  },
  {
    q: "Q.3 The meal that we have in the afternoon",
    a: "LUNCH",
    img: "../assets/images/Lunchakk.png",
  },
];

let current = 0;
let score = 0;
let activeIndex = -1;
let isFocused = false;

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const submitBtn = document.getElementById("submitBtn");

let correctWord = "";
let typedLetters = [];

let savedAnswers = new Array(quizData.length).fill(null);
let locked = new Array(quizData.length).fill(false);

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function loadQuestion() {
  const q = quizData[current];

  qEl.textContent = q.q;
  imgEl.src = q.img;

  correctWord = q.a.toUpperCase();

  if (savedAnswers[current]) {
    typedLetters = [...savedAnswers[current]];
  } else {
    typedLetters = new Array(correctWord.length).fill("");
  }

  activeIndex = -1;
  isFocused = false;

  nextBtn.disabled = !locked[current];
  submitBtn.disabled = typedLetters.includes("") || locked[current];
  prevBtn.disabled = current === 0;

  renderBoxes();
}

const boxContainer = document.getElementById("letterBoxes");

function renderBoxes() {
  boxContainer.innerHTML = "";

  for (let i = 0; i < correctWord.length; i++) {
    const box = document.createElement("div");
    box.classList.add("letter-box");

    if (typedLetters[i]) {
      box.textContent = typedLetters[i];
      box.classList.add("filled");
    }

    if (i === activeIndex && isFocused && !locked[current]) {
      box.classList.add("active");
    }

    if (locked[current]) {
      box.classList.add("correct");
    }

    box.addEventListener("click", (e) => {
      e.stopPropagation(); // 🔥 prevent outside click trigger

      if (locked[current]) return;

      if (i === 0 || typedLetters[i - 1] !== "") {
        activeIndex = i;
        isFocused = true;
        renderBoxes();
      }
    });

    boxContainer.appendChild(box);
  }

  submitBtn.disabled = typedLetters.includes("") || locked[current];
}

// 🔥 CLICK OUTSIDE TO UNFOCUS
document.addEventListener("click", (e) => {
  if (!boxContainer.contains(e.target)) {
    isFocused = false;
    activeIndex = -1;
    renderBoxes();
  }
});

document.addEventListener("keydown", (e) => {
  if (locked[current] || !isFocused || activeIndex === -1) return;

  if (e.key === "Backspace") {
    if (typedLetters[activeIndex] === "" && activeIndex > 0) {
      activeIndex--;
    }
    typedLetters[activeIndex] = "";
    renderBoxes();
    return;
  }

  if (/^[a-zA-Z]$/.test(e.key)) {
    if (activeIndex === 0 || typedLetters[activeIndex - 1] !== "") {
      typedLetters[activeIndex] = e.key.toUpperCase();

      if (activeIndex < correctWord.length - 1) {
        activeIndex++;
      }

      renderBoxes();
    }
  }
});

submitBtn.onclick = () => {
  if (typedLetters.includes("")) return;

  let guess = typedLetters.join("");
  savedAnswers[current] = [...typedLetters];

  if (guess === correctWord) {
    score++;
    showPopup(true);
    speak("Correct");
    fireConfetti();

    locked[current] = true;
    nextBtn.disabled = false;
    submitBtn.disabled = true;

    renderBoxes();

    if (current === quizData.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    showPopup(false);
    speak("Wrong");

    const boxes = document.querySelectorAll(".letter-box");
    boxes.forEach((box) => box.classList.add("wrong"));

    setTimeout(() => {
      typedLetters = new Array(correctWord.length).fill("");
      savedAnswers[current] = null;
      activeIndex = -1;
      isFocused = false;
      renderBoxes();
    }, 500);
  }
};

nextBtn.onclick = () => {
  current++;
  loadQuestion();
};

prevBtn.onclick = () => {
  current--;
  loadQuestion();
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
    `Your Score: ${score} / ${quizData.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);

  popup.style.display = "flex";

  fireConfettif();
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 },
  });
}

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 },
  });
}

loadQuestion();