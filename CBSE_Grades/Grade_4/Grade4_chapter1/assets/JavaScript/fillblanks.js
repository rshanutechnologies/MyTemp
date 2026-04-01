// ================= QUESTIONS =================
const questions = [
  {
    q: "Q.1 The gaseous exchange takes place with the help of _____________ in the leaves",
    a: "stomata",
    img: "../assets/images/FIB1.png",
  },
  {
    q: "Q.2 The leaf stalk carries water from the stem to the leaf through a vein called the _______________,",
    a: "midrib",
    img: "../assets/images/FIB2.png",
  },
  {
    q: "Q.3  ________________ venation is found in many plants that have taproot system.",
    a: "reticulate",
    img: "../assets/images/Reticulate.png",
  },
  {
    q: "Q.4 sunlight is trapped by the _______________ present in the leaves.",
    a: "chlorophyll",
    img: "../assets/images/FIB4.png",
  },
  {
    q: "Q.5 The parasitic plants that completely depend on their host for nutrition are called ____",
    a: "holoparasites",
    img: "../assets/images/FIB5.png",
  },
];

// ================= SPEECH =================
function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

// ================= CONFETTI =================
function smallConfetti() {
  if (typeof confetti !== "undefined") {
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
  }
}

function bigConfetti() {
  if (typeof confetti === "undefined") return;

  const duration = 500;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// ================= STATE =================
let index = 0;
let score = 0;
let popupTimer = null;

const answers = Array(questions.length).fill(null);

// ================= DOM =================
const qText = document.getElementById("qText");
const qImg = document.getElementById("qImg");
const input = document.getElementById("answerInput");
const input2 = document.getElementById("answerInput2");
const check = document.getElementById("checkBtn");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
const popup = document.getElementById("popup");
const popupBox = document.getElementById("popupBox");

// ================= LOAD =================
function load() {
  const q = questions[index];

  if (qText) qText.textContent = q.q;

  // ✅ SAFE IMAGE LOAD
  if (qImg) {
    qImg.src = q.img;
    qImg.style.display = q.img ? "block" : "none";
  }

  const isDouble = Array.isArray(q.a);

  input2.style.display = isDouble ? "block" : "none";

  if (answers[index] === "correct") {
    if (isDouble) {
      input.value = q.a[0];
      input2.value = q.a[1];
      input2.disabled = true;
    } else {
      input.value = q.a;
    }
    input.disabled = true;
  } else {
    input.value = "";
    input2.value = "";
    input.disabled = false;
    input2.disabled = false;
  }

  check.disabled = true;
  prev.disabled = index === 0;
  next.disabled = answers[index] !== "correct";
}

// ================= POPUP =================
function showPopup(html, final = false) {
  if (popupTimer) clearTimeout(popupTimer);

  popup.style.display = "flex";
  popupBox.className = final ? "popup-box popup-final" : "popup-box";
  popupBox.innerHTML = html;

  if (!final) {
    popupTimer = setTimeout(() => {
      popup.style.display = "none";
    }, 1000);
  }

  updateButton();
}

// ================= CHECK =================
check.onclick = () => {
  const q = questions[index];
  const user1 = input.value.trim().toLowerCase();

  if (Array.isArray(q.a)) {
    const user2 = input2.value.trim().toLowerCase();

    if (user1 === q.a[0] && user2 === q.a[1]) {

      if (answers[index] !== "correct") score++;
      answers[index] = "correct";

      speak("Correct");

      // 🎉 CONFETTI
      smallConfetti();
      setTimeout(() => bigConfetti(), 200);

      showPopup(`
        <div class="popup-correct">
          <div>✅ Correct</div>
          <div class="happy">😊</div>
          <div class="stars">${"⭐".repeat(score)}</div>
        </div>
      `);

      input.disabled = true;
      input2.disabled = true;
      check.disabled = true;

      if (index === questions.length - 1) {
        setTimeout(() => {
          bigConfetti();
          showFinal();
        }, 1400);
      } else {
        next.disabled = false;
      }

    } else {
      speak("Wrong");
      input.value = "";
      input2.value = "";

      showPopup(`
        <div>
          <div class="popup-title" style="color:#c62828;">❌ Wrong!</div>
          <span class="popup-emoji">😢</span>
          <div class="popup-tip">💡 Try again!</div>
        </div>
      `);
    }

  } else {

    if (user1 === q.a.toLowerCase()) {

      if (answers[index] !== "correct") score++;
      answers[index] = "correct";

      speak("Correct");

      // 🎉 CONFETTI
      smallConfetti();
      setTimeout(() => bigConfetti(), 200);

      showPopup(`
        <div class="popup-correct">
          <div>✅ Correct</div>
          <div class="happy">😊</div>
          <div class="stars">${"⭐".repeat(score)}</div>
        </div>
      `);

      input.disabled = true;
      check.disabled = true;

      if (index === questions.length - 1) {
        setTimeout(() => {
          bigConfetti();
          showFinal();
        }, 1400);
      } else {
        next.disabled = false;
      }

    } else {
      speak("Wrong");
      input.value = "";

      showPopup(`
        <div>
          <div class="popup-title" style="color:#c62828;">❌ Wrong!</div>
          <span class="popup-emoji">😢</span>
          <div class="popup-tip">💡 Try again!</div>
        </div>
      `);
    }
  }
};

// ================= FINAL =================
function showFinal() {
  showPopup(`
    <div class="popup-final-content">
      🎉 Congratulations!
      <span class="emoji">🏆</span>
      <div>You finished the quiz!</div>
      <div class="final-score">
        Score: ${score}/${questions.length}
      </div>
      <div class="stars">${"⭐".repeat(score)}</div>
      <div class="final-actions">
        <button class="restart" onclick="location.reload()">🔄 Restart</button>
        <button class="home" onclick="location.href='../index.html'">🏠 Home</button>
      </div>
    </div>
  `, true);
}

// ================= NAV =================
prev.onclick = () => {
  index--;
  load();
};

next.onclick = () => {
  index++;
  load();
};

// ================= BUTTON ENABLE =================
function updateButton() {
  const q = questions[index];

  if (Array.isArray(q.a)) {
    check.disabled =
      input.disabled ||
      input2.disabled ||
      !input.value.trim() ||
      !input2.value.trim();
  } else {
    check.disabled =
      input.disabled ||
      !input.value.trim();
  }
}

input.oninput = updateButton;
input2.oninput = updateButton;

// ================= INIT =================
prev.disabled = true;
next.disabled = true;

load();