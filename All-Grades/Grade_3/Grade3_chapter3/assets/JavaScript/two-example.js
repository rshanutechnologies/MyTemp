const questions = [
  {
    text: "Grass eating animals ?",
    answers: ["Cow", "Buffalo"],
    options: [
      { id: "Cow", label: "Cow", img: "../assets/images/cow-img.png" },
      { id: "Lion", label: "Lion", img: "../assets/images/lion-img.png" },
      { id: "Buffalo", label: "Buffalo", img: "../assets/images/buffalo.png" },
    ],
  },
  {
    text: "Flesh eating animals ?",
    answers: ["Tiger", "Lion"],
    options: [
      { id: "Tiger", label: "Tiger", img: "../assets/images/tiger-img.png" },
      { id: "Lion", label: "Lion", img: "../assets/images/lion-img.png" },
      { id: "Panda", label: "Panda", img: "../assets/images/panda-img.png" },
    ],
  },
  {
    text: "Animals which swallow their food ?",
    answers: ["Snake", "Lizard"],
    options: [
      { id: "Snake", label: "Snake", img: "../assets/images/snake-img.png" },
      { id: "Cow", label: "Cow", img: "../assets/images/cow-img.png" },
      { id: "Lizard", label: "Lizard", img: "../assets/images/lizard.png" },
    ],
  },
  {
    text: "Animals which gnaw their food ?",
    answers: ["Rat", "Rabbit"],
    options: [
      { id: "Turtle", label: "Turtle", img: "../assets/images/turtle-img.png" },
      { id: "Rabbit", label: "Rabbit", img: "../assets/images/rabbit-img.png" },
      { id: "Rat", label: "Rat", img: "../assets/images/rat-img.png" },
    ],
  },
  {
    text: "Animals which eat the flesh of dead animals ?",
    answers: ["Vulture", "Crow"],
    options: [
      { id: "Crow", label: "Crow", img: "../assets/images/crow.png" },
      {
        id: "Vulture",
        label: "Vulture",
        img: "../assets/images/vulture-img.png",
      },
      { id: "Deer", label: "Deer", img: "../assets/images/deer-img.png" },
    ],
  },
];

let index = 0;
let score = 0;
let dragged = null;
let selectedOption = null;
const isMobile = window.innerWidth >= 0;
const state = questions.map(() => ({
  drops: [null, null],
  used: [],
  completed: false,
}));

const questionEl = document.querySelector(".question");
const drops = document.querySelectorAll(".drop");
const optionsEl = document.querySelector(".options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const train = document.querySelector(".train-frame");

/* ========== RENDER ========== */
function render() {
  const q = questions[index];
  questionEl.textContent = q.text;

  // OPTIONS
  optionsEl.innerHTML = "";
  q.options.forEach((opt) => {
    const div = document.createElement("div");
    div.className = "option";
    div.draggable =
      !state[index].used.includes(opt.id) && !state[index].completed;
    div.dataset.id = opt.id;
    div.innerHTML = `<img src="${opt.img}"><span>${opt.label}</span>`;

    if (state[index].used.includes(opt.id) || state[index].completed) {
      div.style.opacity = 0.4;
      div.style.pointerEvents = "none";
    }

   // DRAG (desktop)
div.addEventListener("dragstart", () => {
  if (!isMobile) dragged = opt.id;
});
// CLICK (mobile) → DIRECT PLACE
div.addEventListener("click", () => {
  if (!isMobile) return;

  if (state[index].used.includes(opt.id) || state[index].completed) return;

  // find first empty drop
  const emptyIndex = state[index].drops.findIndex(v => !v);

  if (emptyIndex === -1) return; // no empty box

  placeAnswer(drops[emptyIndex], emptyIndex, opt.id);
});
    optionsEl.appendChild(div);
  });

  // DROPS (restore state only)
  drops.forEach((drop, i) => {
    drop.className = "drop";
    drop.textContent = "Click on a option";
    drop.dataset.locked = "";

    const saved = state[index].drops[i];
    if (saved) {
      drop.textContent = saved;
      drop.classList.add("correct");
      drop.dataset.locked = "true";
    }
  });

  prevBtn.disabled = index === 0;

const completed = state[index].drops.every((v) => v);

nextBtn.disabled = !completed;

prevBtn.classList.toggle("enabled", !prevBtn.disabled);
nextBtn.classList.toggle("enabled", completed);


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
/* ========== DROP LOGIC (ONLY ONCE) ========== */
drops.forEach((drop, i) => {
  drop.addEventListener("dragover", (e) => e.preventDefault());
drop.addEventListener("click", () => {
  if (!isMobile) return;

  if (!selectedOption || drop.dataset.locked) return;
  if (state[index].used.includes(selectedOption)) return;

  placeAnswer(drop, i, selectedOption);
  selectedOption = null;
});

drop.addEventListener("drop", () => {
  if (isMobile) return;

  if (!dragged || drop.dataset.locked) return;
  if (state[index].used.includes(dragged)) return;

  placeAnswer(drop, i, dragged);
  dragged = null;
});
});
function placeAnswer(drop, i, value) {
  drop.textContent = value;
  drop.dataset.locked = "true";

  state[index].drops[i] = value;
  state[index].used.push(value);

  render();

  // CHECK ANSWERS
  if (state[index].drops.every((v) => v)) {
    const correctAnswers = questions[index].answers;
    const userAnswers = state[index].drops;

    const allCorrect = correctAnswers.every((ans) =>
      userAnswers.includes(ans)
    );

    if (allCorrect) {
      showPopup(true);
      speak("Correct");

      state[index].completed = true;
      score++;

      if (index === questions.length - 1) {
        setTimeout(showFinal, 800);
      }
    } else {
      showPopup(false);
      speak("Wrong");

      setTimeout(() => {
        state[index].drops = [null, null];
        state[index].used = [];
        render();
      }, 600);
    }
  }
}


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
    msg.textContent = "Nice choice!";
  } else {
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

/* ========== NAV ========== */
prevBtn.onclick = () => {
  if (index > 0) {
    index--;
    render();
  }
};

nextBtn.onclick = () => {
  if (index < questions.length - 1 && state[index].drops.every((v) => v)) {
    index++;
    render();
  }
};

function showFinal() {
  train.style.zIndex = "0";
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/5`;
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


function renderTrainBoxes() {
  trainBoxes.innerHTML = "";

  const engine = document.createElement("div");
  engine.className = "engine-box";
  trainBoxes.appendChild(engine);

  for (let i = 0; i < questions.length; i++) {
    const wagon = document.createElement("div");
    wagon.className = "wagon";

    if (state[i].completed) wagon.classList.add("done");
    if (i === index) wagon.classList.add("active");

    wagon.innerHTML = `<span>${i + 1}</span><small>Q</small>`;
    trainBoxes.appendChild(wagon);
  }

  const flag = document.createElement("div");
  flag.className = "flag-box";
  trainBoxes.appendChild(flag);
}

function moveTrainIcon() {
  const wagons = trainBoxes.querySelectorAll(".wagon");
  if (!wagons.length) return;

  const target = wagons[Math.min(index, wagons.length - 1)];
  const targetRect = target.getBoundingClientRect();
  const frameRect = document
    .querySelector(".train-frame")
    .getBoundingClientRect();

  const centerX = targetRect.left + targetRect.width / 2 - frameRect.left - 20;

  movingTrain.style.transform = `translateX(${centerX}px)`;
}

window.addEventListener("resize", moveTrainIcon);

render();
