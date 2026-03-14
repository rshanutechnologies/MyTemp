const questions = [
  {
    text: "Q1. Give two examples of Insectivorous plants.",
    answers: ["pitcher_plant", "venus_flytrap"],
    options: [
      {
        id: "pitcher_plant",
        label: "Pitcher plant",
        cls: "pitcher_plant",
        img: "../assets/images/pitcher-plant.png",
      },
      {
        id: "rose",
        label: "Rose",
        cls: "rose",
        img: "../assets/images/rose-plant.png",
      },
      {
        id: "mango",
        label: "Mango",
        cls: "mango",
        img: "../assets/images/mango-plant.png",
      },
      {
        id: "venus_flytrap",
        label: "Venus flytrap",
        cls: "venus_flytrap",
        img: "../assets/images/venus-flytrap.png",
      },
    ],
  },
  {
    text: "Q2. Give two examples of Total parasites.",
    answers: ["cuscuta", "striga"],
    options: [
      {
        id: "mistletoe",
        label: "Mistletoe",
        cls: "mistletoe",
        img: "../assets/images/mistletoe-img.png",
      },
      {
        id: "hibiscus",
        label: "Hibiscus",
        cls: "hibiscus",
        img: "../assets/images/hibiscus-plant.png",
      },
      {
        id: "cuscuta",
        label: "Cuscuta",
        cls: "cuscuta",
        img: "../assets/images/cuscuta-plant.png",
      },
      {
        id: "striga",
        label: "Striga",
        cls: "striga",
        img: "../assets/images/rafflesia-plant.png",
      },
    ],
  },
  {
    text: "Q3. Give two examples of Partial parasites.",
    answers: ["mistletoe", "sandalwood"],
    options: [
      {
        id: "mistletoe",
        label: "Mistletoe",
        cls: "mistletoe",
        img: "../assets/images/mistletoe-img.png",
      },
      {
        id: "cuscuta",
        label: "Cuscuta",
        cls: "cuscuta",
        img: "../assets/images/cuscuta-plant.png",
      },
      {
        id: "sandalwood",
        label: "Sandalwood",
        cls: "sandalwood",
        img: "../assets/images/sandalwood-img.png",
      },
      {
        id: "neem",
        label: "Neem",
        cls: "neem",
        img: "../assets/images/neem.png",
      },
    ],
  },
  {
    text: "Q4. Give two examples of Root vegetables.",
    answers: ["carrot", "radish"],
    options: [
      {
        id: "carrot",
        label: "Carrot",
        cls: "carrot",
        img: "../assets/images/carrot-img.png",
      },
      {
        id: "radish",
        label: "Radish",
        cls: "radish",
        img: "../assets/images/radish-img.png",
      },
      {
        id: "cabbage",
        label: "Cabbage",
        cls: "cabbage",
        img: "../assets/images/cabbage-img.png",
      },
      {
        id: "tomato",
        label: "Tomato",
        cls: "tomato",
        img: "../assets/images/tomato-img.png",
      },
    ],
  },
  {
    text: "Q5. Give two examples of Leafy vegetables.",
    answers: ["spinach", "cabbage"],
    options: [
      {
        id: "cabbage",
        label: "Cabbage",
        cls: "cabbage",
        img: "../assets/images/cabbage-img.png",
      },
      {
        id: "potato",
        label: "Potato",
        cls: "potato",
        img: "../assets/images/potato-img.png",
      },
      {
        id: "ginger",
        label: "Ginger",
        cls: "ginger",
        img: "../assets/images/ginger-img.png",
      },
      {
        id: "spinach",
        label: "Spinach",
        cls: "spinach",
        img: "../assets/images/spinach-img.png",
      },
    ],
  },
];

let index = 0,
  score = 0;
const state = questions.map(() => ({ selected: [], completed: false }));

const qEl = document.querySelector(".question");
const optEl = document.querySelector(".options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
// const progress = document.getElementById("progressBar");

// function loadProgress() {
//   progress.innerHTML = "";
//   for (let i = 0; i < questions.length; i++) {
//     const d = document.createElement("div");
//     if (state[i].completed) d.classList.add("active");
//     progress.appendChild(d);
//   }
// }

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
  qEl.textContent = q.text;
  optEl.innerHTML = "";

  q.options.forEach((o) => {
    const div = document.createElement("div");
    div.className = `option ${o.cls}`;
    div.innerHTML = `<img src="${o.img}"><span>${o.label}</span>`;

    if (state[index].selected.includes(o.id)) div.classList.add("correct");
    if (state[index].completed) div.classList.add("disabled");

    div.onclick = () => {
      if (state[index].completed) return;

      if (q.answers.includes(o.id) && !state[index].selected.includes(o.id)) {
        div.classList.add("correct");
        state[index].selected.push(o.id);
        speak("Correct");
        showPopup(true);

        if (state[index].selected.length === q.answers.length) {
          state[index].completed = true;
          score++;
          // loadProgress();
          nextBtn.classList.add("enabled");
          if (index === questions.length - 1) {
            nextBtn.classList.remove("enabled");
            setTimeout(showFinal, 1600);
          }
        }
      } else {
        div.classList.add("wrong");
        speak("Wrong");
        showPopup(false);
        setTimeout(() => div.classList.remove("wrong"), 400);
      }
    };
    optEl.appendChild(div);
  });

  prevBtn.classList.toggle("enabled", index > 0);
  nextBtn.classList.toggle("enabled", state[index].completed);
  // loadProgress();
}

prevBtn.onclick = () => {
  if (index > 0) {
    index--;
    render();
  }
};
nextBtn.onclick = () => {
  if (state[index].completed && index < questions.length - 1) {
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
