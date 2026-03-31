const questions = [
  {
    q: "Q1. Oxygen",
    a: ["21%", "breathing"],
    placeholders: ["% of gas", "One use"],
    img: "../assets/images/mcq-1.png",
  },
  {
    q: "Q2. Carbon dioxide",
    a: ["0.04%", "photosynthesis"],
    placeholders: ["% of gas", "One use"],
    img: "../assets/images/mcq1-1.png",
  },
  {
    q: "Q3. Nitrogen",
    a: ["78%", "plant growth"],
    placeholders: ["% of gas", "One use"],
    img: "../assets/images/mcq-2.png",
  },
  {
    q: "Q4. Argon",
    a: ["0.93%","electric bulbs"],
    placeholders: ["% of gas", "One use"],
    img: "../assets/images/FB-5.png",
  }
 
];

let index = 0;
let score = 0;

const questionText = document.getElementById("questionText");
const image = document.getElementById("questionImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const inputsRow = document.getElementById("inputsContainer");

const userAnswers = questions.map((q) => ({
  used: [],
  boxes: q.a.map(() => ({ value: "", correct: false })),
}));

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  speechSynthesis.speak(msg);
}

function smallConfetti() {
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
}

function bigConfetti() {
  confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } });
}

function loadQuestion() {
  const q = questions[index];

  questionText.innerText = q.q;
  image.src = q.img;

  image.classList.toggle(
    "reveal",
    userAnswers[index].boxes.every((b) => b.correct),
  );

  prevBtn.disabled = index === 0;

  inputsRow.innerHTML = "";

  q.a.forEach((_, i) => {
    const box = document.createElement("div");
    box.className = "input-box";

    const input = document.createElement("input");
    input.type = "text";
    // input.placeholder = "Type here...";
    input.placeholder = q.placeholders[i];
    input.value = userAnswers[index].boxes[i].value;

    // ✅ Dynamic placeholder
input.placeholder = q.placeholders[i];

// ✅ VALIDATION FOR FIRST INPUT (percentage)
// if (i === 0) {
//   input.addEventListener("input", () => {
//     // allow only numbers and %
//     input.value = input.value.replace(/[^0-9.%]/g, "");
//   });
// }
if (i === 0) {
  input.addEventListener("input", () => {
    let value = input.value;

    // allow only numbers
    value = value.replace(/[^0-9.]/g, "");

      // ✅ allow 4 digits before decimal
    let [intPart, decPart] = value.split(".");
    if (intPart.length > 4) {
      intPart = intPart.slice(0, 4);
    }

    // limit decimal to 2 digits
    if (decPart !== undefined) {
      decPart = decPart.slice(0, 2);
      value = intPart + "." + decPart;
    } else {
      value = intPart;
    }

   

    // auto add %
    if (value !== "") {
      value = value + "%";
    }

    input.value = value;
  });
}

    const btn = document.createElement("button");
    btn.textContent = "✓";
    btn.disabled = input.value.trim() === "";

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

  if (answers.includes(value) && !state.used.includes(value)) {
    box.classList.add("correct");

    input.disabled = true;
    btn.disabled = true;
    btn.style.cursor = "not-allowed";

    state.used.push(value);
    state.boxes[i] = { value, correct: true };

    speak("Correct");
    smallConfetti();
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
  const done = userAnswers[index].boxes.every((b) => b.correct);
  nextBtn.disabled = !done;

  if (done && !userAnswers[index].scored) {
    score++;
    userAnswers[index].scored = true;
    image.classList.add("reveal");

    if (index === questions.length - 1) {
      setTimeout(showFinal, 1600);
    }
  }
}

nextBtn.onclick = () => {
  if (index < questions.length - 1) {
    index++;
    loadQuestion();
  }
};

prevBtn.onclick = () => {
  if (index > 0) {
    index--;
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

  setTimeout(() => (popup.style.display = "none"), 1400);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");

  document.getElementById("finalScore").textContent =
    `Your Score: ${score} / ${questions.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();
