/* ================= QUIZ DATA ================= */

const quizData = [

{
title: "Q.1 When the wind is fast and strong, it is called ________.",
image: "../assets/images/StormQIak.png",
options: [
{ text: "Air", img: "../assets/images/Airakk.png" },
{ text: "Breeze", img: "../assets/images/Breezeak.png" },
{ text: "Gale", img: "../assets/images/Galeak.png" },
{ text: "Storm", img: "../assets/images/Stormak.png" }
],
answer: "Storm"
},

{
title: "Q.2 We cannot live without ________.",
image: "../assets/images/BoyDrink.png",
options: [
{ text: "Waste", img: "../assets/images/WeastDustbin.png" },
{ text: "Water", img: "../assets/images/WaterGak.png" },
{ text: "Dust", img: "../assets/images/Dustak.png" },
{ text: "Animals", img: "../assets/images/WildAnimals.png" }
],
answer: "Water"
},

{
title: "Q.3 Air is made up of ________.",
image: "../assets/images/Breeeze.png",
options: [
{ text: "Gases", img: "../assets/images/Gasesak.png" },
{ text: "Water", img: "../assets/images/WaterGak.png" },
{ text: "Plastic", img: "../assets/images/Plasticak.png" },
{ text: "Plants", img: "../assets/images/Planttak.png" }
],
answer: "Gases"
},

{
title: "Q.4 ________ is the main source of water.",
image: "../assets/images/RainMainSW.png",
options: [
{ text: "River", img: "../assets/images/Riverakk.png" },
{ text: "Rain", img: "../assets/images/RainWak.png" },
{ text: "Pond", img: "../assets/images/Pondakk.png" },
{ text: "Lake", img: "../assets/images/LakeNak.png" }
],
answer: "Rain"
},

{
title: "Q.5 A ________ helps to produce electricity.",
image: "../assets/images/WindElectricity.png",
options: [
{ text: "Aeroplane", img: "../assets/images/Aeroplaneak.png" },
{ text: "Helicopter", img: "../assets/images/Helicopterak.png" },
{ text: "Windmill", img: "../assets/images/WindMillak.png" },
{ text: "Kite", img: "../assets/images/Kiteak.png" }
],
answer: "Windmill"
}

];

/* ================= STATE ================= */

let current = 0;
let score = 0;
const answerState = quizData.map(() => ({
  answered: false,
  selected: null
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


/* ================= LOAD QUESTION ================= */

function loadQuestion() {
  const q = quizData[current];
  const state = answerState[current];

  titleText.textContent = q.title;
  animalImg.src = q.image;
  animalImg.alt = "Plant Image";

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
  else {
    div.classList.add("fade-wrong");
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

  state.selected = selected; // save selected answer

  const options = document.querySelectorAll(".option");

  if (selected === correct) {

    state.answered = true;
    score++;
    scoreBox.textContent = "Score: " + score;

    options.forEach((o) => {

      const text = o.querySelector(".label").textContent;

      o.classList.add("disabled");

      if (text === correct) {
        o.classList.add("correct-lock");
      } 
      else {
        o.classList.add("fade-wrong");   // fade other options
      }

    });

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

loadQuestion();