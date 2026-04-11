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
    q: "Give one example of a cereal",
    img: "../assets/images/T-1.png",
    answer: "Maize",
    options: ["Maize", "Carrot", "Spinach"],
  },
  {
    q: "Give one example of a pulse",
    img: "../assets/images/T-2.png",
    answer: "Red Gram",
    options: ["Red Gram", "Milk", "Apple"],
  },
  {
    q: "A leaf that we eat",
    img: "../assets/images/T-3.png",
    answer: "Mint",
    options: ["Mint", "Potato", "Rice"],
  },
  {
    q: "A root that we eat",
    img: "../assets/images/T-4.png",
    answer: "Carrot",
    options: ["Carrot", "Mango", "Leaf"],
  },
  {
    q: "Give one example of a climber",
    img: "../assets/images/T-5.png",
    answer: "Pea plant",
    options: ["Pea plant", "Tree", "Herb"],
  },
];

let index = 0;
let correct = Array(questions.length).fill(false);
let userAnswers = Array(questions.length).fill(null);
let finished = false;

const qText = document.getElementById("questionText");
const qImg = document.getElementById("questionImg");
const optEl = document.getElementById("options");
const progress = document.getElementById("progress");
const dropZone = document.querySelector(".drop");
const nextBtn = document.getElementById("next");

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
  qText.textContent = q.q;
  qImg.src = q.img;

  optEl.innerHTML = "";
  nextBtn.style.opacity = correct[index] ? "1" : "0.5";

  // Restore saved answer
  if (userAnswers[index]) {
    dropZone.textContent = userAnswers[index];
    dropZone.style.background = "#d9f5dc";
    dropZone.ondrop = null;
  } else {
   dropZone.textContent = "";
    dropZone.style.background = "#eaf7f7";
    
  }

 q.options
  .sort(() => Math.random() - 0.5)
  .forEach((o, i) => {
    const d = document.createElement("div");
    d.className = "option " + ["a", "b", "c"][i];
    d.innerHTML = `<span>${o}</span>`;

    if (!correct[index]) {
      d.onclick = () => handleClick(o);
    } else {
      d.classList.add("disabled");
    }

    optEl.appendChild(d);
  });

  renderProgress();
  //   speak(q.q);
}

function handleClick(val) {
  const q = questions[index];

  if (val === q.answer) {
    userAnswers[index] = val;
    correct[index] = true;

    // show answer
    dropZone.textContent = val;
    dropZone.style.background = "#d9f5dc";

    nextBtn.style.opacity = "1";

    // disable all options
    document.querySelectorAll(".option").forEach(o => {
      o.classList.add("disabled");
      o.onclick = null;
    });

    showPopup(true);

    if (index === questions.length - 1) {
      setTimeout(showFinalPopup, 1000);
    }

  } else {
    showPopup(false);
  }
}

function showPopup(ok) {
  popup.classList.remove("hidden");
  popupEmoji.textContent = ok ? "👍" : "👎";
  popupTitle.textContent = ok ? "Correct!" : "Try Again";
  popupText.textContent = ok ? "Great job!" : "Try again";
  speak(ok ? "Correct" : "Try again");
  setTimeout(() => {
    if (!finished) popup.classList.add("hidden");
  }, 1000);
}

function showFinalPopup() {
  finished = true;
  popup.classList.remove("hidden");

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
  restart.classList.remove("hidden");
}

prev.onclick = () => {
  if (index > 0) {
    index--;
    render();
  }
};
next.onclick = () => {
  if (index < questions.length - 1 && correct[index]) {
    index++;
    render();
  }
};
restart.onclick = () => location.reload();

render();
