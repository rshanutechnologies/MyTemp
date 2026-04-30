function speak(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}
const questions = [
  {
    q: `Carrot is a ________.`,
    qImg: "../assets/images/C-1.png",
    options: [
      { img: "../assets/images/stem.png", text: "Stem" },
      { img: "../assets/images/root.png", text: "Root" },
      { img: "../assets/images/Leaffak.png", text: "Leaf" },
    ],
    answer: 1,
  },
  {
    q: `Cauliflower is a ________.`,
    qImg: "../assets/images/C-2.png",
    options: [
      { img: "../assets/images/stem.png", text: "Stem" },
      { img: "../assets/images/root.png", text: "Root" },
      { img: "../assets/images/OPT-3.png", text: "Flower" },
    ],
    answer: 2,
  },
  {
    q: `We need ________ to make cloth.`,
    qImg: "../assets/images/C-3.png",
    options: [
      { img: "../assets/images/fiber.png", text: "Fibre" },
      { img: "../assets/images/gum.png", text: "Gum" },
      { img: "../assets/images/rubbur.png", text: "Rubber" },
    ],
    answer: 0,
  },
  {
    q: `Plants that have weak stems and need support to grow are called ________.`,
    qImg: "../assets/images/C-4.png",
    options: [
      { img: "../assets/images/tree.png", text: "Trees" },
      { img: "../assets/images/climber.png", text: "Climbers" },
      { img: "../assets/images/herbs.png", text: "Herbs" },
    ],
    answer: 1,
  },
  {
    q: `Mint plant is an example of a ________.`,
    qImg: "../assets/images/C-5.png",
    options: [
      { img: "../assets/images/climber.png", text: "Climber" },
      { img: "../assets/images/herbs.png", text: "Herb" },
      { img: "../assets/images/creeper.png", text: "Creeper" },
    ],
    answer: 1,
  },
];

let index = 0;
let quizEnded = false;
const correct = Array(questions.length).fill(false);

const qEl = document.getElementById("question");
const circleImg = document.getElementById("questionCircleImg");
const optEl = document.getElementById("options");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");
const popupEmoji = document.getElementById("popupEmoji");
const restartBtn = document.getElementById("restart");

function goHome() {
  if (window.parent !== window) {
    window.parent.postMessage({ type: "goHome" }, "*");
  } else {
    location.href = "./index.html"; // fallback
  }
}

function renderProgress() {
  progress.innerHTML = "";
  questions.forEach((_, i) => {
    const s = document.createElement("div");
    s.className = "step";
    if (i === index) s.classList.add("active");
    if (correct[i]) s.classList.add("correct");
    s.textContent = i + 1;
    progress.appendChild(s);
  });
}

function render() {
  const q = questions[index];
  qEl.textContent = q.q;
  circleImg.src = q.qImg;
  optEl.innerHTML = "";
  prevBtn.disabled = index === 0;
  nextBtn.disabled = !correct[index];

  q.options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerHTML = `<img src="${opt.img}">${opt.text}`;

    if (correct[index]) {
      if (i === q.answer) div.classList.add("correct");
      div.style.pointerEvents = "none";
    } else {
      div.onclick = () => choose(i, div);
    }
    optEl.appendChild(div);
  });

  renderProgress();
}

function showAnswerPopup(isCorrect) {
  restartBtn.classList.add("hidden");

  popup.classList.remove("hidden");
  popupEmoji.textContent = isCorrect ? "👍" : "👎";
  popupTitle.textContent = isCorrect ? "Correct!" : "Try Again";
  popupText.textContent = isCorrect ? "Good job!" : "Try again";
  speak(isCorrect ? "Correct" : "Try again");

  setTimeout(() => {
    if (!quizEnded) popup.classList.add("hidden");
  }, 1200);
}

// function choose(i, el) {
//   if (correct[index]) return;

//   const right = i === questions[index].answer;
//   showAnswerPopup(right);

//   if (!right) {
//     el.classList.add("wrong");

//     // ⭐ remove wrong border automatically
//     setTimeout(() => {
//       el.classList.remove("wrong");
//     }, 700); // adjust timing if needed

//     return;
//   }

//   correct[index] = true;
//   el.classList.add("correct");
//   [...optEl.children].forEach((o) => (o.style.pointerEvents = "none"));

//   if (index === questions.length - 1) {
//     quizEnded = true;
//     setTimeout(showFinalPopup, 1200);
//   } else {
//     nextBtn.disabled = false;
//   }
// }

function choose(i, el) {
  if (correct[index]) return;

  const right = i === questions[index].answer;
  showAnswerPopup(right);

  if (!right) {
    el.classList.add("wrong");
    setTimeout(() => {
      el.classList.remove("wrong");
    }, 700);
    return;
  }

  correct[index] = true;
  el.classList.add("correct");
  [...optEl.children].forEach((o) => (o.style.pointerEvents = "none"));

  // ⭐ ADD THIS LINE (VERY IMPORTANT)
  renderProgress();

  if (index === questions.length - 1) {
    quizEnded = true;
    setTimeout(showFinalPopup, 1200);
  } else {
    nextBtn.disabled = false;
  }
}

function showFinalPopup() {
  popup.classList.remove("hidden");
  //   popupEmoji.innerHTML=`<div class="final-board"></div><div class="pins">🎯 🎯 🎯 🎯 🎯</div>`;
  popupEmoji.innerHTML = `
  <div class="final-board">
    <div class="pins">
      <span class="pin" style="animation-delay:0.2s">🎯</span>
      <span class="pin" style="animation-delay:0.5s">🎯</span>
      <span class="pin" style="animation-delay:0.8s">🎯</span>
      <span class="pin" style="animation-delay:1.1s">🎯</span>
      <span class="pin" style="animation-delay:1.4s">🎯</span>
    </div>
  </div>
`;

  popupTitle.textContent = "Congratulations!";
  popupText.textContent = `Score: ${correct.filter(Boolean).length}/${questions.length}`;
  restartBtn.classList.remove("hidden");

  //   if(window.parent!==window){
  //     window.parent.postMessage("quizFinished","*");
  //   }
}

nextBtn.onclick = () => {
  index++;
  render();
};
prevBtn.onclick = () => {
  index--;
  render();
};

restartBtn.onclick = () => {
  index = 0;
  quizEnded = false;
  correct.fill(false);
  popup.classList.add("hidden");
  restartBtn.classList.add("hidden");

  render();
};

render();
