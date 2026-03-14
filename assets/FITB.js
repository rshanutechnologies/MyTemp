const questions = [
  {
    q: "A chicken is a domestic bird that live on  farms and give us eggs and meat, what do we call a bay chicken has ________.",
    a: "chick",
    img: "../assests/images/q1-img.png",
  },
  {
    q: "A cow gives us ________.",
    a: "milk",
    img: "../assests/images/q2-img.png",
  },
  {
    q: "Fish live in ________.",
    a: "water",
    img: "../assests/images/q3-img.png",
  },
  {
    q: "A panda eats ________.",
    a: "bamboo",
    img: "../assests/images/q4-img.png",
  },
  { q: "Birds can ________.", a: "fly", img: "../assests/images/q5-img.png" },
];

let index = 0;
const answers = Array(questions.length).fill(null);

const qText = document.getElementById("questionText");
const qImg = document.getElementById("questionImage");
const input = document.getElementById("answerInput");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const checkBtn = document.getElementById("checkBtn");
const progressCircles = document.querySelectorAll(".progress-circle");

function speak(text) {
  window.speechSynthesis.cancel(); // stop previous speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function loadQuestion() {
  const q = questions[index];
  qText.textContent = q.q;
  qImg.src = q.img;

  input.value = answers[index] || "";
  input.disabled = !!answers[index];
  checkBtn.disabled = !!answers[index] || input.value.trim() === "";
  nextBtn.disabled = !answers[index];
  prevBtn.disabled = index === 0;

  updateProgress(); // ✅ ADD THIS
}

function updateProgress() {
  progressCircles.forEach((circle, i) => {
    if (answers[i]) {
      circle.classList.add("done");
      circle.textContent = "✔";
    } else {
      circle.classList.remove("done");
      circle.textContent = i + 1;
    }
  });
}

input.addEventListener("input", () => {
  if (!answers[index]) {
    checkBtn.disabled = input.value.trim() === "";
  }
});

checkBtn.addEventListener("click", () => {
  const correct = questions[index].a.toLowerCase();
  const user = input.value.trim().toLowerCase();

  if (user === correct) {
    answers[index] = user;
    input.disabled = true;
    checkBtn.disabled = true;
    nextBtn.disabled = false;

    updateProgress(); // ✅ ADD THIS
    showFeedback(true);

    if (index === questions.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    input.value = "";
    checkBtn.disabled = true;
    showFeedback(false);
  }
});

prevBtn.onclick = () => {
  index--;
  loadQuestion();
};
nextBtn.onclick = () => {
  index++;
  loadQuestion();
};

function showFeedback(correct) {
  const popup = document.getElementById("feedbackPopup");
  const icon = document.getElementById("feedbackIcon");
  const text = document.getElementById("feedbackText");

  if (correct) {
    icon.textContent = "✔";
    text.textContent = "Correct!";
    text.className = "correct";
    speak("Correct");
  } else {
    icon.textContent = "✖";
    text.textContent = "Wrong! Try again";
    text.className = "wrong";
    speak("Wrong");
  }

  popup.style.display = "flex";
  setTimeout(() => (popup.style.display = "none"), 1200);
}

function showFinal() {
  document.getElementById("finalPopup").style.display = "flex";
  document.getElementById("finalScore").textContent = `Score: ${
    answers.filter((a) => a).length
  } / ${questions.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(answers.length);
}

loadQuestion();
