const quizData = [
  {
    q: "1. What is the digestive system?",
    img: "../assets/images/Digestive.png",
    options: [
      {
        text: "The body’s breathing system",
        img: "../assets/images/Breathing_system.png",
      },
      {
        text: "The body’s food processing system",
        img: "../assets/images/Food_p-system.png",
      },
      {
        text: "The body’s nervous system",
        img: "../assets/images/Nervous_system.png",
      },
      {
        text: "The body’s blood transporting system",
        img: "../assets/images/Blood_t_system.png",
      },
    ],
    a: 1,
  },
  {
    q: "2. What happens when food reaches the stomach?",
    img: "../assets/images/stomach.png",
    options: [
      {
        text: "The saliva moistens the food.",
        img: "../assets/images/Saliva_food.png",
      },
      {
        text: "Food moves quickly to the small intestine",
        img: "../assets/images/Food_intestine.png",
      },
      {
        text: " Food is churned into a paste, digestive juices mix with the food and break the down food into a simpler form. ",
        img: "../assets/images/Food_juices.png",
      },
      { text: "None of the above", img: "../assets/images/None.png" },
    ],
    a: 2,
  },
  {
    q: "3. We have eight ________, four on each side of the jaws.",
    img: "../assets/images/teeth.png",
    options: [
      { text: "Incisors", img: "../assets/images/Incisors.png" },
      { text: "Canines", img: "../assets/images/Caninesak.png" },
      { text: "Premolars", img: "../assets/images/Premolars.png" },
      { text: "Molars", img: "../assets/images/Molarak.png" },
    ],
    a: 2,
  },
  {
    q: "4. The ________ is the hardest substance present in the human body.",
    img: "../assets/images/tooth.png",
    options: [
      { text: "Enamel", img: "../assets/images/Enamelak.png" },
      { text: "Pulp", img: "../assets/images/Pulpak.png" },
      { text: "Dentine", img: "../assets/images/Dentine.png" },
      { text: "None", img: "../assets/images/None.png" },
    ],
    a: 0,
  },
  {
    q: "5. The set of milk teeth has ________ teeth.",
    img: "../assets/images/teethset.png",
    options: [
      { text: "22", img: "../assets/images/22ak.png" },
      { text: "32", img: "../assets/images/32ak.png" },
      { text: "12", img: "../assets/images/12ak.png" },
      { text: "20", img: "../assets/images/20ak.png" },
    ],
    a: 3,
  },
];

let current = 0;
let answered = Array(quizData.length).fill(null);

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const imgEl = document.getElementById("qImg");
const dropBox = document.getElementById("dropBox");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

/* 🧩 SAME POPUP FUNCTION */
function showPopup(html, final = false) {
  popup.style.display = "flex";
  popupText.className = final ? "popup-box popup-final" : "popup-box";
  popupText.innerHTML = html;
  if (!final) setTimeout(() => (popup.style.display = "none"), 1000);
}

function loadQuestion() {
  const q = quizData[current];

  document.getElementById("qNo").textContent = `Q${current + 1}.`;
  questionEl.textContent = q.q.replace(/^\d+\.\s*/, "");

  // imgEl.src = q.img;
  optionsEl.innerHTML = "";

  // default drop box
  // 🔁 RESTORE DROP BOX STATE
  if (answered[current] !== null) {
    const ansIndex = answered[current];
  }

  q.options.forEach((optData, i) => {
    const opt = document.createElement("div");
    opt.className = "option";

    opt.innerHTML = `
    <img class="opt-img" src="${optData.img}">
    <span>${optData.text}</span>
  `;

    // restore state
    if (answered[current] !== null) {
      if (i === answered[current]) {
        opt.classList.add("correct");
      } else {
        opt.classList.add("disabled");
      }
    }

    opt.onclick = () => {
      if (answered[current] !== null) return;

      if (i === quizData[current].a) {
        answered[current] = i;

        opt.classList.add("correct");
        speak("Correct");

        [...optionsEl.children].forEach((o, idx) => {
          if (idx !== i) o.classList.add("disabled");
        });

        showPopup(`
        <div class="popup-correct">
          <span class="check">✅ Correct</span>
          <span class="happy">😊</span>
          <div class="stars">⭐</div>
        </div>
      `);

        nextBtn.disabled = false;

        if (answered.every((x) => x !== null)) {
          setTimeout(() => {
            showPopup(
              `
            <div class="popup-final-content">
              🎉 Congratulations!
              <span class="emoji">🏆</span>
              You finished the quiz!
              <div class="final-score">
                Score: <b>${quizData.length}/${quizData.length}</b>
              </div>
              <div class="stars">⭐⭐⭐⭐⭐</div>
              <div class="final-actions">
                <button class="restart" onclick="location.reload()">🔄 Restart</button>
              </div>
            </div>
          `,
              true,
            );
          }, 1200);
        }
      } else {
        speak("Wrong");
        showPopup(`
        <div class="popup-wrong">
          <span class="cross">❌ Wrong</span>
          <span class="sad">😢</span>
          <div class="tip">💡 You can do it!</div>
        </div>
      `);
      }
    };

    optionsEl.appendChild(opt);
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = answered[current] === null;
}

prevBtn.onclick = () => {
  current--;
  loadQuestion();
};
nextBtn.onclick = () => {
  current++;
  loadQuestion();
};

loadQuestion();
function goHome() {
  window.location.href = "/index.html";
}
