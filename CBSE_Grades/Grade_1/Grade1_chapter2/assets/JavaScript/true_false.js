const questions = [
  {
    q: "Q1. Trees are very thin and small plants that live only for a few months.",
    a: false,
    img: "../assets/images/tf-1.png",
  },

  {
    q: "Q2. Red gram is a cereal.",
    a: false,
    img: "../assets/images/tf-2.png",
  },

  {
    q: "Q3. Plants need air and water.",
    a: true,
    img: "../assets/images/tf-3.png",
  },

  {
    q: "Q4. A tree has a hard, woody stem.",
    a: true,
    img: "../assets/images/tf-4.png",
  },

  {
    q: "Q5. Hibiscus is a big plant.",
    a: false,
    img: "../assets/images/tf-5.png",
  },
];

let currentIndex = 0;
let score = 0;

const elements = {
  question: document.getElementById("question"),
  img: document.getElementById("questionImg"),
  trueBtn: document.getElementById("trueBtn"),
  falseBtn: document.getElementById("falseBtn"),
  trueIcon: document.getElementById("trueIcon"),
  falseIcon: document.getElementById("falseIcon"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  popup: document.getElementById("answerPopup"),
  popupIcon: document.getElementById("popupIcon"),
  popupTitle: document.getElementById("popupTitle"),
  popupMsg: document.getElementById("popupMsg"),
  finalPopup: document.getElementById("finalPopup"),
  finalScore: document.getElementById("finalScore"),
  stars: document.getElementById("stars"),
};

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function smallConfetti() {
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } });
}

function clearFeedback() {
  elements.trueIcon.textContent = "";
  elements.falseIcon.textContent = "";
  elements.trueBtn.classList.remove("correct", "wrong");
  elements.falseBtn.classList.remove("correct", "wrong");
  elements.trueBtn.disabled = false;
  elements.falseBtn.disabled = false;
  elements.nextBtn.disabled = true;
}

function showFeedback(correctAnswer) {
  // Show thumbs only when answered correctly
  if (correctAnswer === true) {
    elements.trueIcon.textContent = "👍";
    elements.falseIcon.textContent = "👎";
    elements.trueBtn.classList.add("correct");
    elements.falseBtn.classList.add("wrong");
  } else {
    elements.falseIcon.textContent = "👍";
    elements.trueIcon.textContent = "👎";
    elements.falseBtn.classList.add("correct");
    elements.trueBtn.classList.add("wrong");
  }
}

function renderQuestion() {
  const q = questions[currentIndex];
  elements.question.textContent = q.q;
  elements.img.src = q.img;
  elements.img.alt = " loading";

  clearFeedback();

  elements.prevBtn.disabled = currentIndex === 0;

  // If already answered correctly earlier → show feedback & enable next
  if (questions[currentIndex].answeredCorrectly) {
    showFeedback(q.a);
    elements.nextBtn.disabled = false;
    elements.trueBtn.disabled = true;
    elements.falseBtn.disabled = true;
  }
}

function handleAnswer(selected) {
  const correct = questions[currentIndex].a;
  const isCorrect = selected === correct;

  if (isCorrect) {
    score++;
    speak("Correct");
    smallConfetti();
    questions[currentIndex].answeredCorrectly = true;
    showFeedback(correct);
    elements.nextBtn.disabled = false;
    elements.trueBtn.disabled = true;
    elements.falseBtn.disabled = true;

    showPopup(true);

    if (currentIndex === questions.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    speak("Wrong");
    showPopup(false);
  }
}

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
  bigConfetti();
}

// Event listeners
elements.trueBtn.onclick = () => handleAnswer(true);
elements.falseBtn.onclick = () => handleAnswer(false);

elements.prevBtn.onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
};

elements.nextBtn.onclick = () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
};

// Start
renderQuestion();
