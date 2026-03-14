const questions = [
  {
    q: "Animals that lay eggs.......",
    answers: ["Snake", "Lizard"],
    options: [
      { text: "Cow", img: "../assets/images/cow-img.png" },
      { text: "Snake", img: "../assets/images/snake-img.png" },
      { text: "Lizard", img: "../assets/images/lizard.png" },
    ],
  },
  {
    q: "Animals that move using their limbs ........",
    answers: ["Kangaroo", "Rabbit"],
    options: [
      { text: "Kangaroo", img: "../assets/images/kangaroo.png" },
      { text: "Rabbit", img: "../assets/images/Rabbit.png" },
      { text: "Frog", img: "../assets/images/frog-img.png" },
    ],
  },
  {
    q: "Animals that don’t have limbs ........",
    answers: ["Snake", "Earthworm"],
    options: [
      { text: "Snake", img: "../assets/images/snake-img.png" },
      { text: "Earthworm", img: "../assets/images/earthwarm-img.png" },
      { text: "Frog", img: "../assets/images/frog-img.png" },
    ],
  },
  {
    q: "Animals that breathe through their skin ........",
    answers: ["Newt", "Frog"],
    options: [
      { text: "Newt", img: "../assets/images/newt.png" },
      { text: "Earthworm", img: "../assets/images/earthwarm-img.png" },
      { text: "Frog", img: "../assets/images/frog-img.png" },
    ],
  },
];

let index = 0;
let score = 0;

const inputs = document.querySelectorAll(".answer-input");
const checkBtn = document.getElementById("checkBtn");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const questionText = document.querySelector(".question-pill");
const userAnswers = Array(questions.length).fill(null);
const optionsBox = document.querySelector(".options");

function load() {
  questionText.textContent = questions[index].q;

  const saved = userAnswers[index];

  // render options
  optionsBox.innerHTML = "";
  questions[index].options.forEach((opt) => {
  optionsBox.innerHTML += `
    <div class="option">
      <img src="${opt.img}" alt="" draggable="false">
      <span>${opt.text}</span>
    </div>
  `;
});

  inputs.forEach((input, i) => {
    input.classList.remove("locked");
    input.value = saved ? saved[i] : "";
    input.disabled = !!saved;
  });

  document.querySelectorAll(".dashed").forEach((d) => {
    d.classList.toggle("correct", !!saved);
  });

  // 🔒 FORCE BUTTON STATES
  checkBtn.disabled = true;
  nextBtn.disabled = !saved;
  prevBtn.disabled = index === 0;

  // ✅ Re-check state if answers were restored
  if (saved) {
    checkBtn.disabled = true;
  } else {
    updateCheckBtnState();
  }
}

function updateCheckBtnState() {
  checkBtn.disabled = [...inputs].some((inp) => !inp.value.trim());
}

inputs.forEach((i) => {
  i.addEventListener("input", updateCheckBtnState);
});

function normalize(text) {
  return text.trim().toLowerCase();
}

function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}
checkBtn.onclick = () => {
  // normalize user answers
  const userAns = [...inputs].map((i) => normalize(i.value));

  // normalize correct answers
  const correct = questions[index].answers.map((a) => normalize(a));

  // check if all user answers exist in correct answers
  const isCorrect = userAns.every((a) => correct.includes(a));

  if (isCorrect) {
    score++;
    userAnswers[index] = [...userAns];

    speak("Correct");
    showPopup(true);
    nextBtn.disabled = false;
    checkBtn.disabled = true;

    inputs.forEach((i) => {
      i.disabled = true;
      i.classList.add("locked");
    });

    document.querySelectorAll(".dashed").forEach((d) => {
      d.classList.add("correct");
    });

    if (index === questions.length - 1) {
      setTimeout(showFinal, 1600);
    }
  } else {
    speak("Wrong");
    showPopup(false);
    inputs.forEach((i) => (i.value = ""));
    checkBtn.disabled = true;
  }
};
inputs.forEach((input) => {
  input.addEventListener("dragover", (e) => e.preventDefault());
  input.addEventListener("drop", (e) => e.preventDefault());
});

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
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${questions.length}`;
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
