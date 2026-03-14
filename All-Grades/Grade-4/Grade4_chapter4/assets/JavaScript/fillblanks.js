const questions = [
  {
    q: "1. The __________ are sharp and pointed teeth that help in tearing food.",
    a: "canines",
    img: "../assets/images/teeth.png",
  },
  {
    q: "2. The __________ are located behind the canines.",
    a: "premolars",
    img: "../assets/images/premolar.png",
  },
  {
    q: "3. The __________ is the innermost part of the tooth and lies below the dentine.",
    a: "pulp",
    img: "../assets/images/pulp.png",
  },
  {
    q: "4. The germs cause the tooth to __________.",
    a: "decay",
    img: "../assets/images/decay.png",
  },
  {
    q: "5. The swallowed food enters a hollow tube-like organ called the __________.",
    a: "oesophagus",
    img: "../assets/images/oesophagus.png",
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

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function showPopup(html, final = false) {
  popup.style.display = "flex";
  popupText.className = final ? "popup-box popup-final" : "popup-box";
  popupText.innerHTML = html;
  if (!final) setTimeout(() => (popup.style.display = "none"), 1200);
}

function load() {
  const q = questions[current];
  document.getElementById("qNo").textContent = `Q${current + 1}.`;
  qEl.textContent = q.q.replace(/^\d+\.\s*/, "");
  imgEl.src = q.img;
  input.value = answers[current] || "";
  input.disabled = answers[current] != null;
  input.classList.toggle("input-correct", answers[current] != null);
  submit.disabled = input.value === "";
  next.disabled = answers[current] == null;
  prev.disabled = current === 0;
}

input.addEventListener(
  "input",
  () => (submit.disabled = input.value.trim() === ""),
);

submit.onclick = () => {
  if (input.value.trim().toLowerCase() === questions[current].a) {
    answers[current] = input.value;
    input.disabled = true;
    input.classList.add("input-correct");
    next.disabled = false;
    speak("Correct");
    showPopup(`
      <div class="popup-correct">
        <span class="check">✅ Correct</span>
        <span class="happy">😊</span>
        <div class="stars">⭐</div>
      </div>
    `);
    if (answers.every((a) => a)) {
      setTimeout(() => {
        input.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.1)" },
            { transform: "scale(1)" },
          ],
          { duration: 400 },
        );

        showPopup(
          `
          <div class="popup-final-content">
            🎉 Congratulations!
            <span class="emoji">🏆</span>
               You finished the quiz!
          <div class="final-score">
            Score: <b>${answers.filter((a) => a).length}/${questions.length}</b>
            </div>
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <div class="final-actions">
              <button class="restart" onclick="location.reload()"> 🔄 Restart</button>
            </div>
          </div>
        `,
          true,
        );
      }, 1200);
    }
  } else {
    speak("Wrong");
    showPopup(
      ` <div class="popup-wrong">
        <span class="cross">❌ Wrong</span>
        <span class="sad">😢</span>
        <div class="tip">💡 You can do it!</div>
      </div>
      `,
    );
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
