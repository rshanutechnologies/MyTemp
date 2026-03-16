const questions = [
  {
    q: "Q1. Plants move around in search of food.",
    a: false,
    answered: false,
    img: "../assets/images/g4-tf1.png",
  },
  {
    q: "Q2. Stomata help in trapping the sunlight.",
    a: false,
    answered: false,
    img: "../assets/images/g4-tf2.png",
  },
  {
    q: "Q3. The pitcher plant obtains all the required nutrients from insects.",
    a: false,
    answered: false,
    img: "../assets/images/g4-tf3.png",
  },
  {
    q: "Q4. The stem makes food for the plant",
    a: false,
    answered: false,
    img: "../assets/images/g4-tf4.png",
  },
  {
    q: "Q5. Water and minerals absorbed by the roots travel up to the stem of the plant",
    a: true,
    answered: false,
    img: "../assets/images/g4-tf5.png",
  },
];

let index = 0;
let score = 0;

// const qText = document.getElementById("questionText");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");

// const progress = document.getElementById("progressBar");

// function loadProgress() {
//   progress.innerHTML = "";
//   for (let i = 0; i < questions.length; i++) {
//     const d = document.createElement("div");
//     if (questions[i].answered) d.classList.add("active");
//     progress.appendChild(d);
//   }
// }

function resetButtons() {
  trueBtn.className = "answer-btn true";
  falseBtn.className = "answer-btn false";
}

function render() {
  const current = questions[index];

  const qNo = document.querySelector(".q-no");
  const qTextSpan = document.querySelector(".q-text");

  const [number, ...rest] = current.q.split(" ");
  qNo.textContent = number;
  qTextSpan.textContent = rest.join(" ");

  document.getElementById("questionImage").src = current.img;

  resetButtons();

  if (current.answered) {
    // setKidPosition(rightSide, false);
    nextBtn.disabled = false;

    if (current.a) {
      trueBtn.classList.add("correct");
      falseBtn.classList.add("disabled");
    } else {
      falseBtn.classList.add("correct");
      trueBtn.classList.add("disabled");
    }
  } else {
    nextBtn.disabled = true;
  }

  prevBtn.disabled = index === 0;

  const answeredCount = questions.filter((q) => q.answered).length;
  // loadProgress();
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

function answer(val) {
  const current = questions[index];
  if (current.answered) return;

  if (val === current.a) {
    current.answered = true;

    const answeredCount = questions.filter((q) => q.answered).length;

    nextBtn.disabled = false;

    if (current.a) {
      trueBtn.classList.add("correct");
      falseBtn.classList.add("disabled");
    } else {
      falseBtn.classList.add("correct");
      trueBtn.classList.add("disabled");
    }

    score++;
    // loadProgress();
    speak("Correct");
    showPopup(true);

    if (index === questions.length - 1) {
      nextBtn.disabled = true;
      setTimeout(showFinal, 1600);
    }
  } else {
    speak("Wrong");
    showPopup(false);
    const wrongBtn = val ? trueBtn : falseBtn;
    wrongBtn.classList.add("wrong");

    setTimeout(() => {
      wrongBtn.classList.remove("wrong");
    }, 600);
  }
}

function next() {
  if (nextBtn.disabled) return;
  if (index < questions.length - 1) {
    index++;
    render();
  }
}

function prev() {
  if (index > 0) {
    index--;
    render();
  }
}

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

  document.getElementById("finalScore").textContent = `Score: ${score}/5`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

  // 🎉 CONFETTI EFFECT
  if (window.innerWidth >= 769) {
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
}

render();
