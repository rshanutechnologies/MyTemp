const questions = [
  {
    text: "Give two examples of animals that hibernate.",
    img: "../assets/images/Q1.png",
    answers: ["bear", "bat"],
    options: [
      { id: "bear", label: "Bear", emoji: "🐻" },
      { id: "bat", label: "Bat", emoji: "🦇" },
      { id: "lion", label: "Lion", emoji: "🦁" },
      { id: "eagle", label: "Eagle", emoji: "🦅" },
    ],
  },
  {
    text: "Give two examples of animals that aestivate.",
    img: "../assets/images/new-Q2.png",
    answers: ["snail", "crocodile "],
    options: [
      { id: "crocodile ", label: "Crocodile ", emoji: "🐊" },
      { id: "wolf", label: "Wolf", emoji: "🐺" },
      { id: "snail", label: "Snail", emoji: "🐌" },
      { id: "shark", label: "Shark", emoji: "🦈" },
    ],
  },
  {
    text: "Give two examples of animals with horns.",
    img: "../assets/images/new-Q3.png",
    answers: ["ibex", "buffalo"],
    options: [
      { id: "cat", label: "Cat", emoji: "🐱" },
      { id: "ibex", label: "Ibex", emoji: "🦌" },
      { id: "buffalo", label: "buffalo", emoji: "🐃" },
      { id: "rabbit", label: "Rabbit", emoji: "🐰" },
    ],
  },
  {
    text: "Give two examples of animals with spines.",
    img: "../assets/images/Q4.png",
    answers: ["porcupine", "hedgehog"],
    options: [
      { id: "porcupine", label: "Porcupine", emoji: "🦔" },
      { id: "dog", label: "Dog", emoji: "🐶" },
      { id: "horse", label: "Horse", emoji: "🐎" },
      { id: "hedgehog", label: "Hedgehog", emoji: "🦔" },
    ],
  },
  {
    text: "Give two examples of animals living in grasslands.",
    img: "../assets/images/new-Q5.png",
    answers: ["lion", "deer"],
    options: [
      { id: "polarbear", label: "Polar Bear", emoji: "🐻‍❄️" },
      { id: "penguin", label: "Penguin", emoji: "🐧" },
      { id: "lion", label: "Lion", emoji: "🦁" },
      { id: "deer", label: "Deer", emoji: "🦌" },
    ],
  },
];

let index = 0,
  score = 0;
const state = questions.map(() => ({ selected: [], completed: false }));

const progress = document.querySelector(".progress");

function stars() {
  progress.innerHTML = "";

  questions.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "item";

    if (state[i].completed) {
      d.classList.add("active");
      d.textContent = "⭐";
    } else {
      d.classList.add("lock");
      d.textContent = "🔒";
    }

    progress.appendChild(d);
  });
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

function render() {
  const q = questions[index];
  stars();
  document.getElementById("qIndex").textContent = `Q${index + 1}.`;
  document.getElementById("qText").textContent = q.text;
  document.getElementById("topicImg").src = q.img;

  const optBox = document.getElementById("optionsBox");
  optBox.innerHTML = "";

  resetDropZone("drop1");
  resetDropZone("drop2");

  q.options.forEach((o) => {
    const div = document.createElement("div");
    const isSelected = state[index].selected.includes(o.id);
    const isFinished = state[index].completed;
    const shouldBeDisabled = isSelected || isFinished;

    div.className = `option-card ${shouldBeDisabled ? "disabled" : ""}`;
    div.id = o.id;
    div.innerHTML = `<span class="option-emoji">${o.emoji}</span><span class="option-label">${o.label}</span>`;

    if (shouldBeDisabled) {
      div.style.opacity = "0.5";
      div.draggable = false;
    } else {
      div.draggable = true;
      div.ondragstart = (e) => {
        e.dataTransfer.setData("text", e.target.closest(".option-card").id);
        div.style.opacity = "0.5";
      };
      div.ondragend = () => {
        div.style.opacity = "1";
      };
    }
    optBox.appendChild(div);
  });

  state[index].selected.forEach((id, i) => {
    const optionData = q.options.find((o) => o.id === id);
    showInDropZone(optionData, document.getElementById(`drop${i + 1}`));
  });

  updateUI();
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  const zone = ev.target.closest(".drop-box");
  if (zone.classList.contains("filled")) return;

  const id = ev.dataTransfer.getData("text");
  const q = questions[index];

  if (q.answers.includes(id)) {
    state[index].selected.push(id);
    const optionData = q.options.find((o) => o.id === id);
    showInDropZone(optionData, zone);
    speak("Correct");
    showPopup(true);
    stars();

    if (state[index].selected.length === q.answers.length) {
      state[index].completed = true;
      score++;
      setTimeout(render, 500); // Re-render to apply disabled state to all
      if (index === questions.length - 1) setTimeout(showFinal, 1600);
    } else {
      render(); // Re-render to disable the specific correct one
    }
  } else {
    speak("Wrong");
    showPopup(false);
    const el = document.getElementById(id);
    el.classList.add("error");
    setTimeout(() => el.classList.remove("error"), 400);
  }
}

function showInDropZone(option, target) {
  target.innerHTML = `<span style="font-size:30px; margin-right:10px">${option.emoji}</span>
            <span style="font-weight:100; color:var(--success);">${option.label}</span>`;
  target.classList.add("filled");
}

function resetDropZone(id) {
  const zone = document.getElementById(id);
  zone.classList.remove("filled");
  zone.innerHTML = `<span class="drop-hint">Drag & Drop here</span>`;
}

function updateUI() {
  document.getElementById("prevBtn").classList.toggle("active", index > 0);
  document
    .getElementById("nextBtn")
    .classList.toggle("active", state[index].completed);
}

function changeQuestion(step) {
  if (step === -1 && index === 0) return;
  if (step === 1 && !state[index].completed) return;
  index += step;
  render();
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

render();
