/* ================= POPUP SYSTEM ================= */

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  icon.style.animation = "none";
  void icon.offsetWidth;
  icon.style.animation = "";

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";

    speak("Correct");
    fireConfetti();

  } else {
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";

    speak("Wrong");
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score} / ${questions.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);

  fireConfettif();
}


/* ================= QUESTIONS ================= */

const questions = [

  {
    q: "Q.1 The size of the _ _ _ _ _ is one's own fist.",
    a: "heart",
    img: "../assets/images/hearttt.png"
  },

  {
    q: "Q.2 The skin is an _ _ _ _ _ part of our body.",
    a: "outer",
    img: "../assets/images/Skin.png"
  },

  {
    q: "Q.3 Our _ _ _ _ _ help us write.",
    a: "hands",
    img: "../assets/images/hands.png"
  },

  {
    q: "Q.4 The _ _ _ _ _ helps us remember.",
    a: "brain",
    img: "../assets/images/brain.png"
  },

  {
    q: "Q.5 The lungs are known as the _ _ _ _ _ _ _ ",
    a: "breathing",
    img: "../assets/images/Lungs.png"
  }

];

let index = 0;
let score = 0;
const answers = Array(questions.length).fill(null);


/* ================= ELEMENTS ================= */

const qImgEl   = document.getElementById("qImg");
const qTextEl  = document.getElementById("qText");
const prev     = document.getElementById("prevBtn");
const next     = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");

const input    = document.getElementById("answerInput");
const submitBtn= document.getElementById("submitBtn");


/* ================= FUNCTIONS ================= */

function updateScore() {
  scoreBox.textContent = "Score: " + score;
}

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-UK";
  msg.volume = 0.3;
  msg.rate = 1.0;
  msg.pitch = 1.0;
  speechSynthesis.speak(msg);
}


/* ================= CHECK ANSWER ================= */

function checkAnswer(){

  const correct = questions[index].a.toLowerCase();
  const userAnswer = input.value.trim().toLowerCase();

  if(userAnswer === correct){

    score++;
    updateScore();

    showPopup(true);

    answers[index] = correct;

    input.disabled = true;
    submitBtn.disabled = true;

    next.disabled = false;

    if(index === questions.length - 1){
      setTimeout(showFinal,1600);
    }

  }else{

    showPopup(false);
    input.value = "";

  }

}


/* ================= LOAD QUESTION ================= */

function loadQuestion(){

  const q = questions[index];

  qImgEl.src = q.img;
  qTextEl.textContent = q.q;
input.value = "";
input.disabled = false;
submitBtn.style.display = "inline-block";
submitBtn.disabled = true;

  

  const alreadyCorrect = !!answers[index];

 if(alreadyCorrect){

  input.value = q.a.toUpperCase();
  input.disabled = true;

  submitBtn.style.display = "none";   // hide submit button

}
  prev.disabled = index === 0;
  next.disabled = !alreadyCorrect;

}

input.addEventListener("input", () => {

  if(input.value.trim().length > 0){
    submitBtn.disabled = false;
  }else{
    submitBtn.disabled = true;
  }

});

/* ================= EVENTS ================= */

submitBtn.onclick = checkAnswer;

prev.onclick = () => {
  index--;
  loadQuestion();
};

next.onclick = () => {
  if(index < questions.length - 1){
    index++;
    loadQuestion();
  }
};


/* ================= CONFETTI ================= */

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 }
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 }
  });
}


/* ================= START ================= */

updateScore();
loadQuestion();