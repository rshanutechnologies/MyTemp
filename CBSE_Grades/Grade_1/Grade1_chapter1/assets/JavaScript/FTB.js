const questions = [
  {
    question: "Q1. Animals are ______ things.",
    hint: "Opposite of non-living",
    answer: "living",
    image: "../assets/images/ftb-1.png",
  },
  {
    question: "Q2. Living things can get rid of ______ from their bodies.",
    hint: "Our body removes this unwanted material",
    answer: "waste",
    image: "../assets/images/ftb-2.png",
  },
  {
    question: "Q3. Plants don't ______ from one place to another.",
    hint: "Humans and animals can do this",
    answer: "move",
    image: "../assets/images/ftb-3.png",
  },
  {
    question: "Q4. ______ things have young ones.",
    hint: "They grow and reproduce",
    answer: "living",
    image: "../assets/images/ftb-4.png",
  },
  {
    question: "Q5. A mountain is a ______ thing.",
    hint: "It does not grow, breathe, or reproduce",
    answer: "Natural non-living",
    image: "../assets/images/ftb-5.png",
  },
];

let currentQuestion = 0;
let score = 0;

const answers = new Array(questions.length).fill(null);

const questionText = document.getElementById("questionText");
const hintText = document.getElementById("hintText");
const image = document.getElementById("questionImage");
const input = document.getElementById("answerInput");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

function loadQuestion() {
  const q = questions[currentQuestion];
  questionText.innerText = q.question;
  hintText.innerHTML = `<span style="margin-right:10px;font-size:16px;font-weight:600;">Hint :</span> ${q.hint}`;
  image.src = q.image;

  input.value = answers[currentQuestion] || "";

  input.disabled = answers[currentQuestion] !== null;

  submitBtn.disabled = answers[currentQuestion] !== null || !input.value.trim();

  input.classList.remove("input-wrong", "input-correct");

  if (answers[currentQuestion] !== null) {
    input.classList.add("input-correct");
  }

  prevBtn.disabled = currentQuestion === 0;
  nextBtn.disabled = answers[currentQuestion] === null;
}

input.addEventListener("input", () => {
  if (answers[currentQuestion] === null) {
    submitBtn.disabled = !input.value.trim();
  }
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

function smallConfetti() {
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } });
}

submitBtn.onclick = function () {
  const userAnswer = input.value.trim().toLowerCase();
  const correctAnswer = questions[currentQuestion].answer.toLowerCase();

  if (userAnswer === correctAnswer) {
    answers[currentQuestion] = userAnswer;
    score++;

    input.classList.remove("input-wrong");
    input.classList.add("input-correct");

    speak("Correct");
    showPopup(true);
    smallConfetti();

    loadQuestion();

    if (answers.every((a) => a !== null)) {
      setTimeout(showFinal, 1600);
    }
  } else {
    input.classList.remove("input-correct");
    input.classList.add("input-wrong");

    showPopup(false);
    speak("Wrong");

    setTimeout(() => {
      input.classList.remove("input-wrong");
    }, 600);

    input.value = "";
    submitBtn.disabled = true;
  }
};

nextBtn.onclick = function () {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  }
};

prevBtn.onclick = function () {
  if (currentQuestion > 0) {
    currentQuestion--;
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
  bigConfetti();
}

function restartQuiz() {
  location.reload();
}

loadQuestion();
