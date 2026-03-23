/* ================= QUIZ DATA ================= */
const quizData = [

{
title: "Q.1 Animals that live in our houses are called ____________________.",
options: [
{ text: "Domestic Animals", img: "../assets/images/Cow.png" },
{ text: "Pet Animals", img: "../assets/images/Dogg.png" },
{ text: "Wild Animals", img: "../assets/images/Tigerak.png" },
{ text: "Insects", img: "../assets/images/Butterflyak.png" }
],
answer: "Domestic Animals"
},

{
title: "Q.2 ____________________ is a flesh-eating animal.",
options: [
{ text: "Deer", img: "../assets/images/Deerak.png" },
{ text: "Zebra", img: "../assets/images/Zebraak.png" },
{ text: "Horse", img: "../assets/images/Horse.png" },
{ text: "Lion", img: "../assets/images/Lionakkkk.png" }
],
answer: "Lion"
},

{
title: "Q.3 A ____________________ carries load for us.",
options: [
{ text: "Cat", img: "../assets/images/Catak.png" },
{ text: "Deer", img: "../assets/images/Deerak.png" },
{ text: "Donkey", img: "../assets/images/Donkeyyy.png" },
{ text: "Tiger", img: "../assets/images/Tigerak.png"}
],
answer: "Donkey"
},

{
title: "Q.4 The skin of an animal is used to make ____________________.",
options: [
{ text: "Leather", img: "../assets/images/Leatherak.png" },
{ text: "Paper", img: "../assets/images/paper.png" },
{ text: "Plastic", img: "../assets/images/Plasticak.png" },
{ text: "Cloth", img: "../assets/images/Clothesak.png" }
],
answer: "Leather"
},

{
title: "Q.5 Birds have ____________________ on their bodies.",
options: [
{ text: "Hair", img: "../assets/images/BirdHair.png" },
{ text: "Fur", img: "../assets/images/BirdFur.png" },
{ text: "Feathers", img: "../assets/images/BirdFeather.png" },
{ text: "Scales", img: "../assets/images/BirdScales.png" }
],
answer: "Feathers"
}

];

/* ================= STATE ================= */

let current = 0;
let score = 0;

const answerState = quizData.map(() => ({
  answered: false,
}));


/* ================= ELEMENTS ================= */

const titleText = document.getElementById("titleText");
const optionsBox = document.getElementById("optionsBox");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");


/* ================= TTS ================= */

function speak(text) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(text);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}


/* ================= LOAD QUESTION ================= */

function loadQuestion() {
  const q = quizData[current];
  const state = answerState[current];

  titleText.textContent = q.title;
 

  optionsBox.innerHTML = "";

  q.options.forEach((opt) => {
    const div = document.createElement("div");
    div.className = "option";
div.innerHTML = `
    <img src="${opt.img}" class="option-img">
<span class="label">${opt.text}</span>
`;

    if (state.answered) {
      div.classList.add("disabled");
      if (opt.text === q.answer) {
        div.classList.add("correct-lock");
      }
    } else {
      div.onclick = () => checkAnswer(div, opt.text);
    }

    optionsBox.appendChild(div);
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !state.answered;
}


/* ================= CHECK ANSWER ================= */

function checkAnswer(optionDiv, selected) {
  const state = answerState[current];
  if (state.answered) return;

  const correct = quizData[current].answer;

  if (selected === correct) {
    state.answered = true;
    score++;
    scoreBox.textContent = "Score: " + score;

    document.querySelectorAll(".option").forEach((o) => {
      o.classList.add("disabled");
      o.onclick = null;
    });

    optionDiv.classList.add("correct-lock");
    nextBtn.disabled = false;

    speak("Correct");
    showPopup(true);
     fireConfetti(); 

    if (current === quizData.length - 1) {
      setTimeout(showFinal, 1600);
    }

  } else {
    speak("Wrong");
    optionDiv.classList.add("wrong-shake");
    showPopup(false);

    setTimeout(() => {
      optionDiv.classList.remove("wrong-shake");
    }, 600);
  }
}


/* ================= POPUPS (NEW SYSTEM) ================= */

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

    // 🔥 RESET animation (important)
  icon.style.animation = "none";
  void icon.offsetWidth; 
  icon.style.animation = "";

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}


function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${quizData.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);
     fireConfettif(); 

 
}


/* ================= BUTTONS ================= */

nextBtn.onclick = () => {
  if (current < quizData.length - 1) {
    current++;
    loadQuestion();
  }
};

prevBtn.onclick = () => {
  if (current > 0) {
    current--;
    loadQuestion();
  }
};


function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 }
  });
}


function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 }
  });
}
/* ================= START ================= */

loadQuestion();