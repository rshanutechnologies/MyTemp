/* TRUE / FALSE QUESTIONS */
const questions = [
  {
    q: "The canines are used for cutting food.",
    a: false,
    img: "../assets/images/tf1-img.png",
  },
  {
    q: "The saliva in the mouth converts the starch in the food into sugar.",
    a: true,
    img: "../assets/images/saliva.png",
  },
  {
    q: "Babies are born with teeth.",
    a: false,
    img: "../assets/images/babyteeth.png",
  },
  {
    q: " The undigested food is thrown out of the body through an opening called the anus.",
    a: true,
    img: "../assets/images/Digestion.png",
  },
  {
    q: "Food passes into the stomach directly from the mouth.",
    a: false,
    img: "../assets/images/tf5-img.png",
  },
];

let current = 0;
const answered = Array(questions.length).fill(null);

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImage");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");

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

  // reset buttons
  trueBtn.disabled = false;
  falseBtn.disabled = false;
  trueBtn.classList.remove("active");
  falseBtn.classList.remove("active");

  // restore answered state
  if (answered[current] !== null) {
    const correct = q.a;

    if (correct) {
      trueBtn.classList.add("active");
      falseBtn.disabled = true;
    } else {
      falseBtn.classList.add("active");
      trueBtn.disabled = true;
    }
  }

  prev.disabled = current === 0;
  next.disabled = answered[current] === null;
}

function checkAnswer(choice) {
  if (answered[current] !== null) return; // 🔒 prevent re-answer

  if (choice === questions[current].a) {
    answered[current] = choice;
    next.disabled = false;

    // lock buttons
    if (choice) {
      trueBtn.classList.add("active");
      falseBtn.disabled = true;
    } else {
      falseBtn.classList.add("active");
      trueBtn.disabled = true;
    }

    speak("Correct");

    showPopup(`
      <div class="popup-correct">
        <span>✅ Correct</span>
        <span class="happy">😊</span>
        <div class="stars">⭐</div>
      </div>
    `);

    if (answered.every((v) => v !== null)) {
      setTimeout(() => {
        showPopup(
          `
          <div class="popup-final-content">
            <span class="title">🎉 Congratulations!</span>
            <span class="emoji">🏆</span>
            <span class="message">You finished the quiz!</span>
            <span class="final-score">
              Score: <b>${questions.length}/${questions.length}</b>
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
    speak("Wrong");
    showPopup(`
      <div class="popup-wrong">
        <span class="wrong-text">❌ Wrong</span>
        <span class="sad">😢</span>
        <div class="tip">💡 You can do it!</div>
      </div>
    `);
  }
}

prev.onclick = () => {
  current--;
  load();
};
next.onclick = () => {
  current++;
  load();
};

load();
