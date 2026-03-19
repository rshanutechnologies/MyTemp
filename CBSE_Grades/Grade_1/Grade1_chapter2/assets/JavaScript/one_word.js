const quizData = [
  {
    q: "Q1. Plants with thin, soft and green stems",
    a: "HERB",
    img: "../assets/images/ow-11.png",
  },
  {
    q: "Q2. Plants that live for few years",
    a: "SHRUB",
    img: "../assets/images/ow-12.png",
  },
  {
    q: "Q3. The woody stem of a tree",
    a: "TRUNK",
    img: "../assets/images/ow-13.png",
  },
  {
    q: "Q4. Plants with thin and brown stems",
    a: "CLIMBER",
    img: "../assets/images/ow-14.png",
  },
  {
    q: "Q5. A part of a plant",
    a: "LEAF",
    img: "../assets/images/ow-15.png",
  },
];

let currentQuestionIndex = 0;
let quizScore = 0;

const answeredQuestions = Array(quizData.length).fill(false);
const storedAnswers = Array(quizData.length).fill("");

const questionTitle = document.getElementById("questionTitle");
const questionImage = document.getElementById("questionImage");

const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");
const submitButton = document.getElementById("submitButton");

const answerSlotsContainer = document.getElementById("answerSlots");
const letterContainer = document.getElementById("letterContainer");

let correctAnswer = "";
let letterTiles = [];

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

function shuffleLetters(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createAnswerSlots(word) {
  answerSlotsContainer.innerHTML = "";
  for (let i = 0; i < word.length; i++) {
    const slot = document.createElement("div");
    slot.className = "answer-slot";
    slot.onclick = () => removeLetterFromSlot(slot);
    answerSlotsContainer.appendChild(slot);
  }
}

function removeLetterFromSlot(slot) {
  if (slot.classList.contains("locked")) return;

  const letter = slot.textContent;
  if (!letter) return;

  slot.textContent = "";

  const tile = letterTiles.find(
    (t) => t.textContent === letter && t.classList.contains("used"),
  );

  if (tile) {
    tile.classList.remove("used");
    tile.onclick = () => insertLetterIntoSlot(tile, letter);
  }

  submitButton.disabled = true;
}

function generateLetterTiles(answer) {
  letterContainer.innerHTML = "";
  letterTiles = [];
  let letters = answer.split("");
  shuffleLetters(letters);
  letters.forEach((letter) => {
    const tile = document.createElement("div");

    tile.className = "letter-tile";
    tile.textContent = letter;

    tile.onclick = () => insertLetterIntoSlot(tile, letter);

    letterContainer.appendChild(tile);
    letterTiles.push(tile);
  });
}

function insertLetterIntoSlot(tile, letter) {
  const slots = document.querySelectorAll(".answer-slot");

  const empty = [...slots].find((s) => !s.textContent);

  if (!empty) return;

  empty.textContent = letter;

  tile.classList.add("used");
  tile.onclick = null;

  validateSlotCompletion();
}

function validateSlotCompletion() {
  const slots = document.querySelectorAll(".answer-slot");

  let word = [...slots].map((s) => s.textContent).join("");

  if (word.length === correctAnswer.length) {
    submitButton.disabled = false;
  }
}

function removeLastFilledSlot() {
  const slots = document.querySelectorAll(".answer-slot");

  const filled = [...slots].filter((s) => s.textContent);

  if (filled.length === 0) return;

  const last = filled[filled.length - 1];

  const letter = last.textContent;

  last.textContent = "";

  const tile = letterTiles.find(
    (t) => t.textContent === letter && t.classList.contains("used"),
  );

  if (tile) {
    tile.classList.remove("used");
    tile.onclick = () => insertLetterIntoSlot(tile, letter);
  }

  submitButton.disabled = true;
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
    `Your Score: ${quizScore} / ${quizData.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(quizScore);
  popup.style.display = "flex";
  bigConfetti();
}

function renderQuestion() {
  const question = quizData[currentQuestionIndex];

  questionTitle.textContent = question.q;
  questionImage.src = question.img;

  correctAnswer = question.a.toUpperCase();

  createAnswerSlots(correctAnswer);

  if (answeredQuestions[currentQuestionIndex]) {
    const slots = document.querySelectorAll(".answer-slot");
    const saved = storedAnswers[currentQuestionIndex].split("");

    saved.forEach((letter, i) => {
      slots[i].textContent = letter;
      slots[i].classList.add("locked");
    });

    generateLetterTiles(correctAnswer);

    letterTiles.forEach((tile) => {
      tile.classList.add("used");
      tile.onclick = null;
    });

    submitButton.disabled = true;
    nextButton.disabled = false;
  } else {
    generateLetterTiles(correctAnswer);
    submitButton.disabled = true;
    nextButton.disabled = true;
  }

  previousButton.disabled = currentQuestionIndex === 0;
}

submitButton.onclick = () => {
  const slots = document.querySelectorAll(".answer-slot");

  let guess = [...slots].map((s) => s.textContent).join("");

  if (guess === correctAnswer) {
    quizScore++;

    showPopup(true);
    speak("Correct");
    smallConfetti();

    answeredQuestions[currentQuestionIndex] = true;
    storedAnswers[currentQuestionIndex] = guess;

    slots.forEach((s) => s.classList.add("locked"));

    submitButton.disabled = true;
    nextButton.disabled = false;

    if (currentQuestionIndex === quizData.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    showPopup(false);
    speak("Wrong");

    setTimeout(() => {
      slots.forEach((s) => (s.textContent = ""));
      letterTiles.forEach((tile) => {
        tile.classList.remove("used");
        tile.onclick = () => insertLetterIntoSlot(tile, tile.textContent);
      });
      submitButton.disabled = true;
    }, 800);
  }
};

nextButton.onclick = () => {
  currentQuestionIndex++;
  renderQuestion();
};

previousButton.onclick = () => {
  currentQuestionIndex--;
  renderQuestion();
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Backspace" || e.key === "Delete") {
    removeLastFilledSlot();
  }
});

renderQuestion();
