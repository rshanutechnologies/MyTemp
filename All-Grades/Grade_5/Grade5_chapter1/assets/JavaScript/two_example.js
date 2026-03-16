let popupTimer = null;

const quizData = [
  {
    q: "Q.1 The second whorl of a flower -_______.",
    a: "Petals",
    img: "../assets/images/petalsak.png"
  },
  {
    q: "Q.2 The bi-lobed structure at the free end of a filament - _______.",
    a: "Anther",
    img: "../assets/images/anther.png"
  },
  {
    q: "Q.3 The reproductive cells that ovules contain -_______.",
    a: "Ova",
    img: "../assets/images/Eggcells.png"
  },
  {
    q: "Q.4 A sweet liquid that some flowers produce -_______ .",
    a: "Nectar",
    img: "../assets/images/Nectar.png"
  },
  {
    q: "Q.5 The female reproductive cells- _______.",
    a: "Ova",
    img: "../assets/images/ovules.png"  
  }
];

let current = 0;
let score = 0;

const answered = Array(quizData.length).fill(false);
const userAnswers = Array(quizData.length).fill("");

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const input = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

// function speak(t){
//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(t));
// }

function speak(t) {
  speechSynthesis.cancel();   // optional but recommended


  const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";  
  msg.volume = 0.25;   // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}
function showPopup(html, final = false){
  popup.style.display = "flex";
  popupText.className = final ? "popup-box popup-final" : "popup-box";
  popupText.innerHTML = html;

  if(popupTimer) clearTimeout(popupTimer);

  if(!final){
    popupTimer = setTimeout(()=>{
      popup.style.display = "none";
    }, 1000);
  }
}

/* 🔄 LOAD QUESTION */
function loadQuestion(){
  const q = quizData[current];

  qEl.textContent = q.q;

  /* ✅ SET IMAGE */
  imgEl.src = q.img;
  imgEl.style.display = "block";

  input.value = userAnswers[current] || "";
  input.disabled = answered[current];
  submitBtn.disabled = answered[current];

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !answered[current];
}

/* ✅ SUBMIT */
submitBtn.onclick = () => {
  if(answered[current]) return;

  const userAns = input.value.trim().toLowerCase();
  const correctAns = quizData[current].a.toLowerCase();

  if(userAns === correctAns){
    answered[current] = true;
    userAnswers[current] = userAns;
    score++;

    speak("Correct");

    showPopup(`
      <div class="popup-correct">
        <div>✅ Correct</div>
        <div class="happy">😊</div>
        <div class="stars">${"⭐".repeat(current + 1)}</div>
      </div>
    `);

    nextBtn.disabled = false;

    if(current === quizData.length - 1){
      setTimeout(()=>{
        showPopup(`
          <div class="popup-final-content">
            <div>🎉 Congratulations!</div>
            <span class="emoji">🏆</span>
            <div>You finished the quiz!</div>

            <div class="final-score">
              Score: <b>${score} / ${quizData.length}</b>
            </div>

            <div class="stars">⭐⭐⭐⭐⭐</div>

            <div class="final-actions">
              <button class="restart" onclick="location.reload()">🔄 Restart</button>
           
            </div>
          </div>
        `, true);

        nextBtn.disabled = true;
        prevBtn.disabled = true;
      }, 800);
    }

  } else {
    speak("Wrong");

    showPopup(`
      <div class="popup-wrong">
        <div>❌ Wrong</div>
        <div class="sad">😢</div>
        <div class="tip">💡 Try again!</div>
      </div>
    `);

    input.value = "";
  }
};

nextBtn.onclick = () => {
  current++;
  loadQuestion();
};

prevBtn.onclick = () => {
  current--;
  loadQuestion();
};

loadQuestion();
