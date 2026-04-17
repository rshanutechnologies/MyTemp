// ✅ Sounds
const correctSound = new Audio(
  "https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3",
);
const wrongSound = new Audio(
  "https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3",
);

// ✅ Text-to-Speech Helper (ONLY says correct/wrong)
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

// ✅ 5 Questions Quiz Data
const quizData = [
  {
    question: "Our body has ________ parts.",
    image: "../assets/images/BodyPartssWorkk.png",
    options: [
      {
        id: "b",
        label: " same ",
        img: "../assets/images/opt11.png",
        correct: false,
        border: "#FF8A3D",
      },
      {
        id: "a",
        label: " different ",
        img: "../assets/images/opt12.png",
        correct: true,
        border: "#70B7FF",
      },
      {
        id: "c",
        label: "opposite ",
        img: "../assets/images/opt13.png",
        correct: false,
        border: "#98B64D",
      },
      //   { id: "d", label: "Insect ", emoji: "🐛", correct: false, border: "#FFC542" },
    ],
  },
  {
    question: " We run with our ____. ",
    image: "../assets/images/MCQ2.png",
    options: [
      {
        id: "b",
        label: " legs ",
        img: "../assets/images/opt21.png",
        correct: true,
        border: "#70B7FF",
      },
      {
        id: "c",
        label: "hands ",
        img: "../assets/images/opt22.png",
        correct: false,
        border: "#FFC542",
      },
      {
        id: "d",
        label: "ears ",
        img: "../assets/images/opt23.png",
        correct: false,
        border: "#98B64D",
      },
      // { id: "a", label: "Bird ", emoji: "🦜", correct: true, border: "#FF8A3D" },
    ],
  },
  {
    question: " We feel things with our ______. ",
    image: "../assets/images/MCQ3.png",
    options: [
      {
        id: "b",
        label: " head ",
        img: "../assets/images/opt31.png",
        correct: false,
        border: "#FF8A3D",
      },
      {
        id: "a",
        label: "skin ",
        img: "../assets/images/skin1.png",
        correct: true,
        border: "#98B64D",
      },
      {
        id: "c",
        label: "nose ",
        img: "../assets/images/opt33.png",
        correct: false,
        border: "#70B7FF",
      },
      //   { id: "d", label: "Insect ", emoji: "🐛", correct: false, border: "#FFC542" },
    ],
  },
  {
    question: "Our _____ helps us to remember. ",
    image: "../assets/images/Rememberingbrain.png",
    options: [
      {
        id: "b",
        label: " brain",
        img: "../assets/images/opt41.png",
        correct: true,
        border: "#98B64D",
      },
      {
        id: "c",
        label: " lungs ",
        img: "../assets/images/opt42.png",
        correct: false,
        border: "#FF8A3D",
      },
      {
        id: "a",
        label: "stomach",
        img: "../assets/images/opt43.png",
        correct: false,
        border: "#FFC542",
      },
      //   { id: "d", label: "Water", emoji: "💧", correct: false, border: "#70B7FF" },
    ],
  },
  {
    question: " Our eyes help us to _____. ",
    image: "../assets/images/opt52.png",
    options: [
      {
        id: "a",
        label: " hear",
        img: "../assets/images/opt51.png",
        correct: false,
        border: "#70B7FF",
      },
      {
        id: "b",
        label: "see",
        img: "../assets/images/MCQ5.png",
        correct: true,
        border: "#FF8A3D",
      },
      {
        id: "c",
        label: "taste",
        img: "../assets/images/opt533.png",
        correct: false,
        border: "#98B64D",
      },
      //   { id: "d", label: "Insect ", emoji: "🐛", correct: false, border: "#FFC542" },
    ],
  },
];

// ✅ State
let current = 0;
let score = 0;

const solvedMap = {};

// ✅ Elements
const questionTextEl = document.getElementById("questionText");
const questionImageEl = document.getElementById("questionImage");
const optionsWrapEl = document.getElementById("optionsWrap");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressTextEl = document.getElementById("progressText");

// ✅ Popup Elements
// const popup = document.getElementById("popup");
// const popupText = document.getElementById("popupText");

// ✅ YOUR POPUP JS FUNCTION (EXACT)
// function showPopup(html, final=false){
//   popup.style.display = "flex";
//   popupText.className = final ? "popup-box popup-final" : "popup-box";
//   popupText.innerHTML = html;
//   if(!final) setTimeout(() => popup.style.display = "none", 1000);
// }

// ✅ Render question
function renderQuestion() {
  const q = quizData[current];
  const solved = solvedMap[current]?.solved === true;
  const correctId = solvedMap[current]?.correctId || null;

  questionTextEl.textContent = q.question;
  questionImageEl.src = q.image;

  //   progressTextEl.textContent = `📌 Question ${current + 1} / ${quizData.length} | Score: ${score} 🏆`;

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !solved;

  optionsWrapEl.innerHTML = "";

  q.options.forEach((opt) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "option";
    optionDiv.style.borderColor = opt.border;

    if (solved) {
      optionDiv.classList.add("disabled");

      if (opt.id === correctId) {
        optionDiv.classList.remove("disabled");
        optionDiv.classList.add("correct-highlight");

        const badge = document.createElement("div");
        badge.className = "badge";
        badge.textContent = "🎯 Correct";
        optionDiv.appendChild(badge);
      }
    }

    optionDiv.innerHTML += `
  <img src="${opt.img}" class="option-img" />
  <div class="option-label">${opt.label}</div>
`;

    optionDiv.addEventListener("click", () => selectOption(opt, optionDiv));
    optionsWrapEl.appendChild(optionDiv);
  });
}

// ✅ Select logic
function selectOption(opt, optionDiv) {
  if (solvedMap[current]?.solved) return;

  if (opt.correct) {
    solvedMap[current] = { solved: true, correctId: opt.id };
    score++;

    // ✅ Text-to-speech ONLY
    speakText("Correct");

    // ✅ Sound
    correctSound.currentTime = 0;
    correctSound.play();

    // ✅ CORRECT POPUP (YOUR CODE)
    // showPopup(`
    //   <div class="popup-correct">
    //     <span class="check">✅ Correct</span>
    //     <span class="happy">😊</span>
    //     <div class="stars">${"⭐".repeat(current + 1)}</div>
    //   </div>
    // `);
    showPopup("correct");

    renderQuestion();

    // ✅ FINAL POPUP after last question
    // if (current === quizData.length - 1) {
    //   setTimeout(() => {
    //     showPopup(`
    //       <div class="popup-final-content">
    //         🎉 Congratulations!
    //         <span class="emoji">🏆</span>
    //         You finished the quiz!
    //         <div class="final-score">Score: <b>${score} / ${quizData.length}</b></div>
    //         <div class="stars">⭐⭐⭐⭐⭐</div>
    //         <button class="restart" onclick="location.reload()">🔄Restart</button>
    //       </div>
    //     `, true);
    //   }, 1100);
    // }

    if (current === quizData.length - 1) {
      setTimeout(() => {
        showPopup("final", score, quizData.length);
      }, 1600);
    }
  } else {
    // 🔊 Speak
    speakText("Wrong");

    // 🔊 Sound
    wrongSound.currentTime = 0;
    wrongSound.play();

    // ❌ Blink red border
    optionDiv.classList.add("wrong-blink");

    // Remove animation class so it can trigger again
    setTimeout(() => {
      optionDiv.classList.remove("wrong-blink");
    }, 600);

    // ❌ Popup
    showPopup("wrong");
  }
}

// ✅ Prev / Next
prevBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (!solvedMap[current]?.solved) return;
  if (current < quizData.length - 1) {
    current++;
    renderQuestion();
  }
});

// ✅ Init
renderQuestion();

function showPopup(type, score = 0, total = 0) {
  const popup = document.getElementById("answer-popup");
  const popupIcon = document.getElementById("popup-icon");
  const popupTitle = document.getElementById("popup-title");
  const popupMessage = document.getElementById("popup-message");

  popup.style.display = "flex";
  popup.classList.remove("correct", "wrong", "final");

  // ✅ Correct
  if (type === "correct") {
    popup.classList.add("correct");
    popupIcon.textContent = "🥳";
    popupTitle.textContent = "Correct!";
    popupMessage.textContent = "Well done!";

    setTimeout(() => (popup.style.display = "none"), 1500);
  }

  // ✅ Wrong
  else if (type === "wrong") {
    popup.classList.add("wrong");
    popupIcon.textContent = "😔";
    popupTitle.textContent = "Wrong!";
    popupMessage.textContent = "Try again!";

    setTimeout(() => (popup.style.display = "none"), 1500);
  }

  // ✅ Final Score Popup
  else if (type === "final") {
    popup.classList.add("final");
    popupIcon.textContent = "🏆";
    popupTitle.textContent = "Congratulations!";
    popupMessage.innerHTML = `
      You finished the quiz! <br/>
      <b>Score: ${score} / ${total}</b> <br/><br/>
      ⭐⭐⭐⭐⭐ <br/><br/>
      <button class="restart" onclick="location.reload()">🔄 Restart</button>
    `;
    // ❌ no auto hide
  }
}
