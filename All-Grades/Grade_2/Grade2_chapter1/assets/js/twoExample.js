// ✅ Sounds
const correctSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3");
const wrongSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3");

// ✅ Text-to-Speech
// function speakText(text) {
//   if (!("speechSynthesis" in window)) return;

//   speechSynthesis.cancel();

//   const utter = new SpeechSynthesisUtterance(text);
//   utter.rate = 1;
//   utter.pitch = 1.1;
//   utter.volume = 1;

//   // ⭐ Load voices and select UK English
//   const voices = speechSynthesis.getVoices();

//   const ukVoice =
//     // voices.find(v => v.lang === "en-GB") ||      // best match
//     // voices.find(v => v.lang.includes("en-GB")) || 
//     voices.find(v => v.name.includes("UK"));
//     // voices.find(v => v.name.includes("British"));

//   if (ukVoice) {
//     utter.voice = ukVoice;
//   }

//   speechSynthesis.speak(utter);
// }


function speakText(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";  
  msg.volume = 0.25; 
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}
/* ✅ Questions */
const questions = [
  {
    q: "An action that we do with our legs",
    a: "Walk",
    image: "../assets/images/T1.png",
    options: ["Walk", "Flying", "Gaming"]
  },
  {
    q: "A part that is located inside our head",
    a: "Brain",
    image: "../assets/images/T2.png",
    options: [ "Liver", "Heart","Brain"]
  },
  {
    q: "The sense organ that helps us to hear ",
    a: "Ears",
    image: "../assets/images/T3.png",
    options: [ "Nose", "Ears","Tongue"]
  },
  {
    q: "An internal organ",
    a: "Lungs",
    image: "../assets/images/opt42.png",
    options: ["Lungs", "Skin", "Hand"]
  },
  {
    q: "An external organ",
    a: "Shoulder",
    image: "../assets/images/shoulder.png",
    options: [ "Lungs","Shoulder", "Brain"]
  }
];

let index = 0;
let score = 0;

/* ✅ STORE ANSWERS (THIS IS MAIN CHANGE)
   solvedMap[index] = { solved:true, answer:"Tyres" }
*/
const solvedMap = {}; 

const qText = document.getElementById("questionText");
const imgEl = document.getElementById("questionImage");
const optionsWrap = document.getElementById("optionsWrap");
const answerInput = document.getElementById("answerInput");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

/* ✅ Render */
function renderQuestion() {
  const q = questions[index];
  const solved = solvedMap[index]?.solved === true;
  const savedAnswer = solvedMap[index]?.answer || "";

  // text + image
  qText.textContent = q.q;
  imgEl.src = q.image || "";

  // ✅ show saved correct answer in left box (if solved)
  answerInput.value = solved ? savedAnswer : "";
  answerInput.disabled = true;

  // nav buttons
  prevBtn.disabled = index === 0;
  nextBtn.disabled = !solved;

  // options
  optionsWrap.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option";

    // ✅ same UI colors
    const colors = [
      { bg: "#ddf7ee", text: "#155e36", icon: "🛞" },
      { bg: "#fff3db", text: "#8a4b00", icon: "🎛️" },
      { bg: "#e7f0ff", text: "#0b3b8d", icon: "👉" }
    ];
    const c = colors[i % colors.length];
    btn.style.background = c.bg;
    btn.style.color = c.text;

    btn.innerHTML = `<span style="font-size:28px;">${c.icon}</span> <span>${opt}</span>`;

    // ✅ disable once solved
    if (solved) btn.classList.add("disabled");

    btn.onclick = () => selectOption(opt);
    optionsWrap.appendChild(btn);
  });
}

/* ✅ Option select */
function selectOption(opt) {
  if (solvedMap[index]?.solved) return;

  const correct = questions[index].a.toLowerCase().trim();
  const user = opt.toLowerCase().trim();

  if (user === correct) {
    // ✅ save answer so Prev shows it
    solvedMap[index] = { solved: true, answer: opt };
    score++;

    // show correct answer in left box
    answerInput.value = opt;

    speakText("Correct");
    correctSound.currentTime = 0;
    correctSound.play();

    showPopup("correct");
    renderQuestion();

    // ✅ Final popup after last question
    if (index === questions.length - 1) {
      setTimeout(() => {
        showPopup("final", score, questions.length);
      }, 1600);
    }

  } else {
    speakText("Wrong");
    wrongSound.currentTime = 0;
    wrongSound.play();
    showPopup("wrong");
  }
}

/* ✅ Prev */
prevBtn.onclick = () => {
  if (index > 0) {
    index--;
    renderQuestion();
  }
};

/* ✅ Next */
nextBtn.onclick = () => {
  if (!solvedMap[index]?.solved) return;
  if (index < questions.length - 1) {
    index++;
    renderQuestion();
  }
};

/* ✅ Popup (same as MCQ + FITB) */
function showPopup(type, score = 0, total = 0) {
  const popup = document.getElementById("answer-popup");
  const popupIcon = document.getElementById("popup-icon");
  const popupTitle = document.getElementById("popup-title");
  const popupMessage = document.getElementById("popup-message");

  popup.style.display = "flex";
  popup.classList.remove("correct", "wrong", "final");

  if (type === "correct") {
    popup.classList.add("correct");
    popupIcon.textContent = "🥳";
    popupTitle.textContent = "Correct!";
    popupMessage.textContent = "Well done!";
    setTimeout(() => (popup.style.display = "none"), 1500);
  } else if (type === "wrong") {
    popup.classList.add("wrong");
    popupIcon.textContent = "😔";
    popupTitle.textContent = "Wrong!";
    popupMessage.textContent = "Try again!";
    setTimeout(() => (popup.style.display = "none"), 1500);
  } else if (type === "final") {
    popup.classList.add("final");
    popupIcon.textContent = "🏆";
    popupTitle.textContent = "Congratulations!";
    popupMessage.innerHTML = `
      You finished the quiz! <br/>
      <b>Score: ${score} / ${total}</b> <br/><br/>
      ⭐⭐⭐⭐⭐ <br/><br/>
      <button class="restart" onclick="location.reload()">🔄 Play Again</button>
    `;
  }
}

// init
renderQuestion();
