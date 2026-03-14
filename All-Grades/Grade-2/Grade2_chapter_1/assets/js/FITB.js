const questions = [
  {
    q: "The ____ controls all the parts of our body.",
    a: "brain",
    img: "../assets/images/F1.png"
  },
  {
    q: "Our whole body is covered with ________.",
    a: "skin",
    img: "../assets/images/opt32.png"
  },
  {
    q: "The ________ is located inside our head.",
    a: "brain",
    img: "../assets/images/opt41.png"
  },
  {
    q: "Our ________ help us to pick things.",
    a: "hands",
    img: "../assets/images/opt22.png"
  },
  {
    q: "We have a pair of ________ under our back ribs.",
    a: "kidneys",
    img: "../assets/images/opt42.png"
  },
];

let index = 0,
  score = 0;
const answers = Array(5).fill(null);

const qText = document.getElementById("questionText");
const input = document.getElementById("answerInput");
const checkBtn = document.getElementById("checkBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const inputRow = document.getElementById("inputRow");
const qImg = document.getElementById("questionImg");

// function speak(t) {
//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(t));
// }
function speak(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
   msg.lang = "en-UK";  
  msg.volume = 0.25; 
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

function loadQuestion() {
  const current = questions[index];

  qText.textContent = current.q;
  qImg.src = current.img;   // 🔥 image loads here

  input.value = answers[index] || "";
  input.disabled = !!answers[index];
  inputRow.classList.toggle("correct", !!answers[index]);
  checkBtn.disabled = !!answers[index] || !input.value.trim();
  prevBtn.disabled = index === 0;
  nextBtn.disabled = !answers[index];
}


input.oninput = () => {
  if (!answers[index]) checkBtn.disabled = !input.value.trim();
};



checkBtn.onclick = () => {
  const user = input.value.trim().toLowerCase();

  if (user === questions[index].a) {
    answers[index] = user;
    score++;

    speak("Correct");
    showPopup("correct");

    input.disabled = true;
    inputRow.classList.add("correct");
    checkBtn.disabled = true;
    nextBtn.disabled = false;

    // ✅ Final popup (same like MCQ)
    if (index === questions.length - 1) {
      setTimeout(() => {
        showPopup("final", score, questions.length);
      }, 1600);
    }

  } else {
    speak("Wrong");
    showPopup("wrong");
    input.value = "";
  }
};


prevBtn.onclick = () => {
  index--;
  loadQuestion();
};
nextBtn.onclick = () => {
  index++;
  loadQuestion();
};





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

  // ✅ Final Score (same like MCQ)
  else if (type === "final") {
    popup.classList.add("final");
    popupIcon.textContent = "🏆";
    popupTitle.textContent = "Congratulations!";
    popupMessage.innerHTML = `
      You finished the quiz! <br/>
      <b>Score: ${score} / ${total}</b> <br/><br/>
      ⭐⭐⭐⭐⭐ <br/><br/>
      <button class="restart" onclick="location.reload()">🔄 Play Again</button>
    `;
    // ❌ no auto hide
  }
}



loadQuestion();
