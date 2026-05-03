const questions = [
  {
    q: "Q1.The upper two chambers of the heart are called the ventricles.",
    a: false,
    img: "../assets/images/heart.png"
  },
  {
    q: "Q2.Veins carry blood from the heart to the different parts of the body.",
    a: false,
    img: "../assets/images/veins.png"
  },
  {
    q: "Q3.Blood vessels are the tubes in which blood flows throughout the body.",
    a: true,
    img: "../assets/images/bloodvessel.png"
  },
  {
    q: "Q4.The heart does not pump blood at night.",
    a: false,
    img: "../assets/images/heart1-img.png"
  },
  {
    q: "Q5.Inhalation is taking in oxygen rich air.",
    a: true,
    img: "../assets/images/lungs.png"
  },
];


let index = 0,
  score = 0;
const answers = Array(questions.length).fill(null);
const imgEl = document.getElementById("qImage");

const qEl = document.getElementById("question");
const progress = document.getElementById("progress");
const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
function renderProgress() {
  if (!progress) return;   // ✅ Stop error if progress bar removed
  progress.innerHTML = "";

  questions.forEach((_, i) => {
    const s = document.createElement("div");
    s.className = "station";
    if (i < index) s.classList.add("done");
    if (i === index) s.classList.add("active");
    if (i === questions.length - 1) {
      s.classList.add("finish");
      s.textContent = "🏁";
    } else s.textContent = i + 1;
    progress.appendChild(s);
  });
}

function render() {
  qEl.textContent = questions[index].q;
  imgEl.src = questions[index].img;

  trueBtn.disabled = false;
  falseBtn.disabled = false;
  trueBtn.classList.remove("correct");
  falseBtn.classList.remove("correct");

  if (answers[index] !== null) {
    if (answers[index]) {
      trueBtn.classList.add("correct");
      falseBtn.disabled = true;
    } else {
      falseBtn.classList.add("correct");
      trueBtn.disabled = true;
    }
    nextBtn.disabled = false;
  } else nextBtn.disabled = true;

  prevBtn.disabled = index === 0;
  renderProgress();
}

// function speak(text) {
//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(text));
// }

function speak(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";  
  msg.volume = 0.25;   // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

function answer(val) {
  if (answers[index] !== null) return;

  if (questions[index].a === val) {
    answers[index] = val;
    score++;

    speak("Correct");
    showPopup(true);

    if (val) {
      trueBtn.classList.add("correct");
      falseBtn.disabled = true;
    } else {
      falseBtn.classList.add("correct");
      trueBtn.disabled = true;
    }

    nextBtn.disabled = false;

    // ✅ Show final only if ALL questions answered
    if (answers.every(a => a !== null)) {
      setTimeout(showFinal, 1600);
    }

  } else {
    speak("Wrong");
    showPopup(false);
  }

  renderProgress();
}

trueBtn.onclick = () => answer(true);
falseBtn.onclick = () => answer(false);
prevBtn.onclick = () => {
  if (index > 0) {
    index--;
    render();
  }
};
nextBtn.onclick = () => {
  if (index < questions.length - 1) {
    index++;
    render();
  }
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
if (progress) progress.style.zIndex = "0";
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/5`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

 
}

render();
