const questions = [
  {
    q: "The process by which food is broken down into a simple soluble form that can easily be absorbed by the body.",
    a: "digestion",
    img: "../assets/images/q1.png",
  },
  {
    q: "Four more teeth that come out between the ages of 17 and 21.",
    a: "wisdom teeth",
    img: "../assets/images/q2.png",
  },
  {
    q: "The hard and shiny substance that protects the inner parts of the tooth.",
    a: "enamel",
    img: "../assets/images/q3.png",
  },
  {
    q: "The bone-like substance that makes up the root of the tooth.",
    a: "cementum",
    img: "../assets/images/q4.png",
  },
  {
    q: "The largest and the strongest teeth.",
    a: "molars",
    img: "../assets/images/q5.png",
  },
];

let current = 0;
const answers = Array(questions.length).fill(null);

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImage");
const input = document.getElementById("answerInput");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
const submit = document.getElementById("submitBtn");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

function showPopup(html, final = false) {
  popup.style.display = "flex";
  popupText.className = final ? "popup-box popup-final" : "popup-box";
  popupText.innerHTML = html;
  if (!final) setTimeout(() => (popup.style.display = "none"), 1000);
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

function load() {
  const q = questions[current];
  document.getElementById("qNo").textContent = `Q${current + 1}.`;
  qEl.textContent = q.q;
  imgEl.src = q.img;
  input.value = answers[current] || "";
  input.disabled = answers[current] != null;
  input.classList.toggle("input-correct", answers[current] != null);
  submit.disabled = answers[current] != null || input.value.trim() === "";
  next.disabled = answers[current] == null;
  prev.disabled = current === 0;
}

input.oninput = () => (submit.disabled = input.value.trim() === "");

submit.onclick = () => {
  if (input.value.trim().toLowerCase() === questions[current].a) {
    answers[current] = input.value;
    input.disabled = true;
    input.classList.add("input-correct");
    next.disabled = false;
    submit.disabled = true;

    showPopup(`
      <div class="popup-correct">
        <span>✅ Correct</span>
        <span class="happy">😊</span>
        <div class="stars">⭐</div>
      </div>
    `);
    speak("Correct");

    if (answers.every((a) => a)) {
      setTimeout(() => {
        showPopup(
          `
  <div class="popup-final-content">
    <span class="title">🎉 Congratulations!</span>

    <span class="emoji">🏆</span>

    <span class="message">You finished the quiz!</span>

    <span class="final-score">
      Score: <b>${answers.length} / ${questions.length}</b>
    </span>

    <span class="stars">⭐⭐⭐⭐⭐</span>

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
    showPopup(`
      <div class="popup-wrong">
        <span>❌ Wrong</span>
        <span class="sad">😢</span>
        <div class="tip">💡 You can do it!</div>
      </div>
    `);
    speak("Wrong");

    input.value = "";
  }
};

prev.onclick = () => {
  current--;
  load();
};
next.onclick = () => {
  current++;
  load();
};
load();
