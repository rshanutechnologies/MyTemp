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

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const submitBtn = document.getElementById("submitBtn");

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

  input.value = savedAnswers[current] || "";

  input.disabled = locked[current];

  input.classList.remove("input-correct", "input-wrong");

  submitBtn.disabled = locked[current] || !input.value.trim();

  prevBtn.disabled = current === 0;

  nextBtn.disabled = !locked[current];

  if (locked[current]) {
    input.classList.add("input-correct");
  }
}

const input = document.getElementById("answerInput");

input.addEventListener("input", () => {
  if (!locked[current]) {
    submitBtn.disabled = !input.value.trim();
  }
});

submitBtn.onclick = () => {
  const typedAnswer = input.value.trim();

  const userAnswer = typedAnswer.toUpperCase();

  const correctAnswer = quizData[current].a.toUpperCase();

  if (userAnswer === correctAnswer) {
    savedAnswers[current] =
      typedAnswer.charAt(0).toUpperCase() + typedAnswer.slice(1).toLowerCase();
      input.value = savedAnswers[current];

    locked[current] = true;

    score++;

    input.classList.remove("input-wrong");

    input.classList.add("input-correct");

    showPopup(true);

    speak("Correct");

    fireConfetti();

    nextBtn.disabled = false;

    submitBtn.disabled = true;

    input.disabled = true;

    if (current === quizData.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    showPopup(false);

    speak("Wrong");

    input.classList.add("input-wrong");

    setTimeout(() => {
      input.classList.remove("input-wrong");
    }, 600);

    input.value = "";

    submitBtn.disabled = true;
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
