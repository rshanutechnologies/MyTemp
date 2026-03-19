/* ================= QUIZ DATA ================= */
const quizData = [

{
title: "Q.1 Carrot is a ____________________.",
image: "../assets/images/Carrotakc.png",
options: [
{ text: "Stem", img: "../assets/images/stemM.png" },
{ text: "Root", img: "../assets/images/RootM.png" },
{ text: "Leaf", img: "../assets/images/leafak.png" },
{ text: "Flower", img: "../assets/images/flowerak.png" }
],
answer: "Root"
},

{
title: "Q.2 The ____________________ transports food and water to all the parts of a plant.",
image: "../assets/images/TransportFoot.png",
options: [
{ text: "Root", img: "../assets/images/RootM.png" },
{ text: "Leaf", img: "../assets/images/leafak.png" },
{ text: "Flower", img: "../assets/images/flowerak.png" },
{ text: "Stem", img: "../assets/images/stemM.png" }
],
answer: "Stem"
},

{
title: "Q.3 We need ____________________ to make our clothes.",
image: "../assets/images/Clothesak.png",
options: [
{ text: "Fibre", img: "../assets/images/fiberakc.png" },
{ text: "Gum", img: "../assets/images/gumc.png" },
{ text: "Rubber", img: "../assets/images/ruberakc.png" },
{ text: "Paper", img: "../assets/images/paperc.png" }
],
answer: "Fibre"
},

{
title: "Q.4 Plants that have weak stems and need support to grow are called ____________________.",
image: "../assets/images/Climberakk.png",
options: [
{ text: "Trees", img: "../assets/images/SoftStem.png" },
{ text: "Climbers", img: "../assets/images/ClimbPlant.png" },
{ text: "Herbs", img: "../assets/images/Herbsak.png" },
{ text: "Shrubs", img: "../assets/images/shrub.png" }
],
answer: "Climbers"
},

{
title: "Q.5 Mint plant is an example of a ____________________.",
image: "../assets/images/MintPlant.png",
options: [
{ text: "Climber", img: "../assets/images/ClimbPlant.png" },
{ text: "Herb", img: "../assets/images/Herbsak.png" },
{ text: "Creeper", img: "../assets/images/Creeper.png" },
{ text: "Shrub", img: "../assets/images/Shrub.png" }
],
answer: "Herb"
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
const animalImg = document.getElementById("animalImg");
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


/* ================= IMAGE PRELOAD ================= */

function preloadImages() {
  quizData.forEach(q => {

    const img = new Image();
    img.src = q.image;

    q.options.forEach(opt => {
      const optImg = new Image();
      optImg.src = opt.img;
    });

  });
}

/* ================= LOAD QUESTION ================= */

function loadQuestion() {
  const q = quizData[current];
  const state = answerState[current];

  titleText.textContent = q.title;
animalImg.src = q.image;
animalImg.alt = "Plant Image";
animalImg.loading = "eager";
animalImg.decoding = "async";

  optionsBox.innerHTML = "";

  q.options.forEach((opt) => {
    const div = document.createElement("div");
    div.className = "option";
div.innerHTML = `
<img src="${opt.img}" class="option-img" loading="eager" decoding="async">
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
fireConfetti();   // ⭐ add this

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

/* ================= START ================= */

preloadImages();
loadQuestion();