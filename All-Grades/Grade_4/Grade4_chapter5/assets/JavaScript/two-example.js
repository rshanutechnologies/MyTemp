const questions = [
  {
    text: "Q1. Give two examples of types of soil.",
    img: "../assets/images/Newsoil-img.png",
    answers: ["sandy", "clayey"],
    options: [
      { id: "sandy", label: "Sandy Soil", emoji: "🏖️" },
      { id: "clayey", label: "Clayey Soil", emoji: "🧱" },
      { id: "rocky", label: "Rocky Soil", emoji: "🪨" },
      { id: "dust", label: "Dust", emoji: "💨" },
    ],
  },
  {
    text: "Q2. Give two examples of renewable resources.",
    img: "../assets/images/renewable-img.png",
    answers: ["air", "water"],
    options: [
      { id: "coal", label: "Coal", emoji: "🕳️" },
      { id: "air", label: "Air", emoji: "🌬️" },
      { id: "water", label: "Water", emoji: "🌊" },
      { id: "petrol", label: "Petrol", emoji: "⛽" },
    ],
  },
  {
    text: "Q3. Give two examples of non-renewable resources.",
    img: "../assets/images/Nonrenewable-img.png",
    answers: ["minerals", "fossil fuels"],
    options: [
      { id: "minerals", label: "Minerals", emoji: "💎" },
      { id: "water", label: "Water", emoji: "💧" },
      { id: "fossil fuels", label: "Fossil Fuels", emoji: "🛢️" },
      { id: "air", label: "Air", emoji: "☁️" },
    ],
  },
  {
    text: "Q4. Give two examples of metals.",
    img: "../assets/images/metal-img.png",
    answers: ["iron", "copper"],
    options: [
      { id: "wood", label: "Wood", emoji: "🪵" },
      { id: "iron", label: "Iron", emoji: "⛓️" },
      { id: "copper", label: "Copper", emoji: "🪙" },
      { id: "plastic", label: "Plastic", emoji: "🥤" },
    ],
  },
  {
    text: "Q5. Give two examples of natural resources.",
    img: "../assets/images/natural-img.png",
    answers: ["water", "solar energy"],
    options: [
      { id: "water", label: "Water", emoji: "🌊" },
      { id: "cars", label: "Cars", emoji: "🚗" },
      { id: "solar energy", label: "Solar energy", emoji: "⚡" },
      { id: "buildings", label: "Buildings", emoji: "🏢" },
    ],
  },
];

let index = 0,
  score = 0;
const state = questions.map(() => ({ selected: [], completed: false }));

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

    if (!shouldBeDisabled) {
      div.draggable = true;
      div.ondragstart = (e) => {
        e.dataTransfer.setData("text", e.target.closest(".option-card").id);
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
  ev.currentTarget.classList.add("hover");
}

// Remove hover on leave
document.querySelectorAll(".drop-box").forEach((box) => {
  box.ondragleave = (e) => e.currentTarget.classList.remove("hover");
});

function drop(ev) {
  ev.preventDefault();
  const zone = ev.currentTarget;
  zone.classList.remove("hover");
  if (zone.classList.contains("filled")) return;

  const id = ev.dataTransfer.getData("text");
  const q = questions[index];

  if (q.answers.includes(id)) {
    state[index].selected.push(id);
    const optionData = q.options.find((o) => o.id === id);
    showInDropZone(optionData, zone);
    speak("Correct");
    showPopup(true);

    if (state[index].selected.length === q.answers.length) {
      state[index].completed = true;
      score++;
      setTimeout(render, 500);
      if (index === questions.length - 1) setTimeout(showFinal, 1600);
    } else {
      render();
    }
  } else {
    speak("Wrong");
    showPopup(false);
    zone.classList.add("error");
    setTimeout(() => zone.classList.remove("error"), 500);
  }
}

function showInDropZone(option, target) {
  target.innerHTML = `<span style="font-size:30px; margin-right:15px">${option.emoji}</span>
            <span style="color:var(--brand-dark); font-size: 20px;">${option.label}</span>`;
  target.classList.add("filled");
}

function resetDropZone(id) {
  const zone = document.getElementById(id);
  zone.classList.remove("filled");
  zone.innerHTML = `<span class="drop-hint">Drag and Drop here</span>`;
}

function updateUI() {
  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");
  prev.disabled = index === 0;
  next.disabled = !state[index].completed;
}

function changeQuestion(step) {
  index += step;
  render();
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
