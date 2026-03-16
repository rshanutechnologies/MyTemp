function showPopup(html, final=false){
  const popup = document.getElementById("answerPopup");

  popup.innerHTML = `
    <div class="popup-box">
      ${html}
    </div>
  `;

  popup.style.display = "flex";

  if(!final){
    setTimeout(()=> popup.style.display="none", 1000);
  }
}



const questions = [
  {
    q: "Q.1 Petals enclose and protect the _ _ _ _ _ _ _ _ _  parts of a flower.",
    a: "reproductive",
    img: "../assets/images/Flowerrr.png",
  },
  {
    q: "Q.2 Flowers in which both the male and the female parts are present on the same flower are called _ _ _ _ _ _ _ _ flowers.",
    a: "bisexual",
    img: "../assets/images/bisexualf.png",
  },
  {
    q: "Q.3 The process of pollination happens with the help of _ _ _ _ _ _ _ _ _ _ _ agents.",
    a: "pollinating",
    img: "../assets/images/pollinating.png",
  },
  { q: "Q.4 The _ _ _ _ _ _ is the female reproductive part of a flower.", a: "pistil", img: "../assets/images/pistilak.png" },
  { q: "Q.5 The fertilized female reproductive cell or zygote develops into a _ _ _ _.", a: "seed", img: "../assets/images/seed (1).png" },
];

let index = 0,
  score = 0;
const answers = Array(5).fill(null);

const qImg = (qText = answerInput = submitBtn = null);

const qImgEl = document.getElementById("qImg");
const qTextEl = document.getElementById("qText");
const input = document.getElementById("answerInput");
const submit = document.getElementById("submitBtn");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
const dots = document.getElementById("dots");
const inputBox = document.getElementById("inputBox");
const qCount = document.getElementById("qCount");

function speak(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";  
  msg.volume = 0.25;   // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}
function load() {
  const q = questions[index];
  qImgEl.src = q.img;
  qTextEl.textContent = q.q;
  input.value = answers[index] || "";
  input.disabled = !!answers[index];
  submit.disabled = !!answers[index] || !input.value.trim();
  inputBox.classList.toggle("correct", !!answers[index]);
  prev.disabled = index === 0;
  next.disabled = !answers[index];
  qCount.textContent = `Question ${index + 1} of ${questions.length}`;

  dots.innerHTML = "";
  questions.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "dot" + (answers[i] ? " active" : "");
    dots.appendChild(d);
  });
}

input.oninput = () => {
  if (!answers[index]) submit.disabled = !input.value.trim();
};

submit.onclick = () => {
  if (input.value.trim().toLowerCase() === questions[index].a) {
    answers[index] = questions[index].a;
    score++;
   speak("Correct");
showPopup(`
  <div class="popup-correct">
    <span class="check">✅ Correct</span>
    <span class="happy">😊</span>
    <div class="stars">${"⭐".repeat(index + 1)}</div>
  </div>
`);

    load();
    if (index === 4) setTimeout(showFinal, 1600);
  } else {
  speak("Wrong");
showPopup(`
  <div class="popup-wrong">
    <span class="cross">❌ Wrong</span>
    <span class="sad">😢</span>
    <span class="tip">💡 Try again!</span>
  </div>
`);

    input.value = "";
    submit.disabled = true;
  }
};

prev.onclick = () => {
  index--;
  load();
};
next.onclick = () => {
  index++;
  load();
};

function showFinal(){
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.innerHTML = `
    <div class="popup-box popup-final">
      <div class="popup-final-content">

        <div>🎉 Congratulations!</div>
        <span class="emoji">🏆</span>
        <div>You finished the quiz!</div>

        <div class="final-score">
          Score: <b class="score-text">${score} / ${questions.length}</b>
        </div>

        <div class="stars">${"⭐".repeat(score)}</div>

        <div class="final-btn-row">
          <button class="restart" onclick="location.reload()">🔄 Restart</button>
          
        </div>

      </div>
    </div>
  `;
  finalPopup.style.display = "flex";
}

load();
